package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.PollingCompletedException;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ScheduledFuture;

import static java.util.concurrent.TimeUnit.*;

/**
 * Wrapper to start discovery or execution while linking it on user
 * profile in the database.
 */
@Service
@Profile("!disableDB")
public class ExecutorServiceComponent implements ExecutorService {
    private static final Logger logger = LoggerFactory.getLogger(ExecutorServiceComponent.class);
    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper()
                    .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

    private final int DISCOVERY_TIMEOUT_MINS = Application.getConfig().getInt(ApplicationPropertyKeys.DiscoveryPollingTimeout);
    private final int ETL_TIMEOUT_MINS = Application.getConfig().getInt(ApplicationPropertyKeys.EtlPollingTimeout);
    private final int DISCOVERY_POLLING_FREQUENCY_SECS = Application.getConfig().getInt(ApplicationPropertyKeys.DiscoveryPollingFrequency);
    private final int ETL_POLLING_FREQUENCY_SECS = Application.getConfig().getInt(ApplicationPropertyKeys.EtlPollingFrequency);

    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final EtlService etlService;
    @NotNull private final UserService userService;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    @Autowired
    private ExecutionRepository executionRepository;

    public ExecutorServiceComponent(ApplicationContext context) {
        this.discoveryService = context.getBean(DiscoveryService.class);
        this.etlService = context.getBean(EtlService.class);
        this.userService = context.getBean(UserService.class);
    }

    /**
     * Legacy start discovery from input endpoint.
     * Uses startDiscoveryFromInput but sparqlEndpointIri, dataSampleIri and
     * namedGraphs are set to null.
     *
     * @param discoveryConfig configuration passed to discovery service
     * @param userId web ID of the user who started the discovery
     * @return discovery ID wrapped in JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public Discovery startDiscoveryFromInput(@NotNull String discoveryConfig, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        return startDiscoveryFromInput(discoveryConfig, userId, null, null, null);
    }

    /**
     * Start a discovery using the provided configuration, log the started
     * discovery in the DB on the user profile, notify discovery started via
     * sockets and start status polling.
     *
     * @param discoveryConfig configuration passed to discovery service
     * @param userId web ID of the user who started the discovery
     * @param sparqlEndpointIri SPARQL endpoint IRI provided in frontend to be recorded in the DB
     * @param dataSampleIri data sample IRI provided in frontend to be recorded in the DB
     * @param namedGraphs list of provided named graphs to be recorded in the DB
     * @return discovery ID wrapped in JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public Discovery startDiscoveryFromInput(@NotNull String discoveryConfig, @NotNull String userId, @Nullable String sparqlEndpointIri, @Nullable String dataSampleIri, @Nullable List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInput(discoveryConfig);
        processStartedDiscovery(discovery.id, userId, sparqlEndpointIri, dataSampleIri, namedGraphs);
        return discovery;
    }

    /**
     * Start a discovery using a configuration located at some IRI, log the started
     * discovery in the DB on the user profile, notify discovery started via
     * sockets and start status polling.
     *
     * @param discoveryConfigIri configuration IRI passed to discovery service
     * @param userId web ID of the user who started the discovery
     * @return discovery ID wrapped in JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public Discovery startDiscoveryFromInputIri(@NotNull String discoveryConfigIri, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        processStartedDiscovery(discovery.id, userId, null, null, null);
        return discovery;
    }

    /**
    * Log a discovery onto user, notify discovery started via sockets and
    * start status polling.
    *
    * @param discoveryId ID of the discovery that was started
    * @param userId webId of the user who started the discovery (used for socket notifications)
    * @param sparqlEndpointIri SPARQL endpoint IRI provided in frontend to be recorded in the DB
    * @param dataSampleIri data sample IRI provided in frontend to be recorded in the DB
    * @param namedGraphs list of provided named graphs to be recorded in the DB
    * @throws LpAppsException initial discovery status call failed
    * @throws UserNotFoundException user was not found
    */
    private void processStartedDiscovery(String discoveryId, String userId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        this.userService.setUserDiscovery(userId, discoveryId, sparqlEndpointIri, dataSampleIri, namedGraphs);  //this inserts discovery in DB and sets flags
        notifyDiscoveryStarted(discoveryId, userId);
        startDiscoveryStatusPolling(discoveryId);
    }

    /**
    * Get discovery status, pull discovery out of DB, compile a report and send
    * it via sockets:
    * - room: userId
    * - event name: discoveryAdded
    * - message type: DiscoverySession
    *
    * @param discoveryId ID of the discovery that was started
    * @param userId webId of the user who started the discovery (used for socket notifications)
    * @throws LpAppsException request to Discovery failed
    */
    private void notifyDiscoveryStarted(String discoveryId, String userId) throws LpAppsException {
        DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);
        for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
            DiscoverySession session = new DiscoverySession();
            session.discoveryId = d.getDiscoveryId();
            session.isFinished = discoveryStatus.isFinished;
            session.started = d.getStarted().getTime() / 1000L;
            if (d.getFinished() != null) {
                session.finished = d.getFinished().getTime() / 1000L;
            } else {
                session.finished = -1;
            }
            session.sparqlEndpointIri = d.getSparqlEndpointIri();
            session.dataSampleIri = d.getDataSampleIri();
            session.namedGraphs = new ArrayList<>();
            for (DiscoveryNamedGraphDao ng : d.getNamedGraphs()) {
                session.namedGraphs.add(ng.getNamedGraph());
            }
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("discoveryAdded", OBJECT_MAPPER.writeValueAsString(session));
        }
    }

    /**
     * Call ETL to execute a pipeline, record execution in the DB, notify
     * execution started on sockets and start polling for execution status.
     *
     * @param etlPipelineIri IRI of the ETL pipeline to execute
     * @param userId WebID of the user (used to select where to map execution in DB, where to notify on sockets)
     * @param selectedVisualiser frontend string stored in DB
     * @return execution iri in JSON object for frontend to use
     * @throws LpAppsException request to ETL failed
     * @throws UserNotFoundException user not found
     */
    @NotNull @Override
    public Execution executePipeline(@NotNull String etlPipelineIri, @NotNull String userId, @NotNull String selectedVisualiser) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri, etlPipelineIri, selectedVisualiser);  //this inserts execution in DB
        notifyExecutionStarted(execution.iri, userId);
        startEtlStatusPolling(execution.iri);
        return execution;
    }

    /**
    * Get execution status, pull execution out of DB, compile a report and send
    * it via sockets:
    * - room: userId
    * - event name: executionAdded
    * - message type: PipelineExecution
    *
    * @param executionIri executionIri for which to get status
    * @param userId webId to use for identification of a room where to notify via sockets
    * @throws LpAppsException request to ETL failed
    */
    private void notifyExecutionStarted(String executionIri, String userId) throws LpAppsException {
        ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            PipelineExecution exec = new PipelineExecution();
            exec.status = executionStatus.status;
            exec.executionIri = e.getExecutionIri();
            exec.etlPipelineIri = e.getPipeline().getEtlPipelineIri();
            exec.selectedVisualiser = e.getSelectedVisualiser();
            exec.started = executionStatus.getStarted();
            exec.finished = executionStatus.getFinished();
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("executionAdded", OBJECT_MAPPER.writeValueAsString(exec));
        }
    }

    /**
     * Create a runnable for status checking and schedule it's periodic execution.
     * Also schedule a one-time off runnable to stop polling after a while.
     *
     * Status is fetched from the ETL and updated in the database.
     * If execution is finished we report it via sockets and stop periodic
     * execution by throwing PollingCompletedException.
     *
     * Status message on sockets:
     * - room: executionIri
     * - event name: executionStatus
     * - message type: EtlStatusReport
     *
     * @param executionIri execution IRI to poll for
     */
    private void startEtlStatusPolling(final String executionIri) {
        Runnable checker = () -> {
            PipelineInformationDao pipeline = null;
            try {
                ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);

                //persist status in DB and get pipeline information
                for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                    //there should be only one
                    e.setStatus(executionStatus.status);
                    if (!executionStatus.status.isPollable()) {
                        e.setFinished(executionStatus.finished);
                    }
                    pipeline = e.getPipeline();
                    executionRepository.save(e);
                }

                if (!executionStatus.status.isPollable()) {
                    EtlStatusReport report = EtlStatusReport.createStandardReport(executionStatus, executionIri, pipeline);

                    try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(executionIri)
                            .sendEvent("executionStatus",
                                       OBJECT_MAPPER.writeValueAsString(report));
                    } catch (LpAppsException ex) {
                        logger.error("Failed to report execution status: " + executionIri, ex);
                    }
                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                logger.error("Got exception when polling for ETL status.", e);

                EtlStatusReport report = EtlStatusReport.createErrorReport(executionIri, false, pipeline);
                try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", OBJECT_MAPPER.writeValueAsString(report));
                } catch (LpAppsException ex) {
                    logger.error("Failed to report execution status: " + executionIri, ex);
                }
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, ETL_POLLING_FREQUENCY_SECS, ETL_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                if (e.getStatus() != EtlStatus.FINISHED) {
                    logger.info("Cancelling execution");
                    EtlStatusReport report = EtlStatusReport.createErrorReport(executionIri, true, null);

                    try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", OBJECT_MAPPER.writeValueAsString(report));
                    } catch (LpAppsException ex) {
                        logger.error("Failed to report execution status: " + executionIri, ex);
                    }

                    cancelExecution(e, executionIri);
                }
            }
        };

        logger.info("Scheduling canceler to run in " + ETL_TIMEOUT_MINS + " minutes.");
        Application.SCHEDULER.schedule(canceller, ETL_TIMEOUT_MINS, MINUTES);
    }

    private void cancelExecution(final ExecutionDao e, final String executionIri) {
        try {
            etlService.cancelExecution(executionIri);
            e.setStatus(EtlStatus.CANCELLED);
            // technically this should go to cancelling and then cancelled by ETL, but we don't care anymore
        } catch (LpAppsException ex) {
            logger.warn("Failed to cancel execution " + executionIri, ex);
            e.setStatus(EtlStatus.UNKNOWN);
        }
        executionRepository.save(e);
    }

    /**
     * Cancel an execution identified by IRI.
     * It will report final status using sockets.
     * Also, polling thread is still running until the actual ETL status won't
     * stop being "pollable".
     *
     * @param executionIri execution IRI to cancel
     */
    @Override
    public void cancelExecution(final String executionIri) {
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            cancelExecution(e, executionIri);
        }
    }

    /**
     * Create a runnable for status checking and schedule it's periodic execution.
     * Also schedule a one-time off runnable to stop polling after a while.
     *
     * Status is fetched from the Discovery and updated in the database.
     * If execution is finished we report it via sockets and stop periodic
     * execution by throwing PollingCompletedException.
     *
     * Status message on sockets:
     * - room: discoveryId
     * - event name: discoveryStatus
     * - message type: DiscoveryStatusReport
     *
     * @param discoveryId discovery id to poll for
     */
    private void startDiscoveryStatusPolling(String discoveryId) {
        Runnable checker = () -> {
            DiscoveryDao dao = null;
            try {
                DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);

                if (discoveryStatus.isFinished) {
                    Date finished = new Date();

                    for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                        d.setExecuting(false);
                        d.setFinished(finished);
                        discoveryRepository.save(d);
                        dao = d;
                    }

                    logger.info("Reporting discovery finished in room " + discoveryId);
                    DiscoveryStatusReport report = DiscoveryStatusReport.createStandardReport(discoveryId, discoveryStatus, finished, dao);

                    try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId)
                            .sendEvent("discoveryStatus",
                                   OBJECT_MAPPER.writeValueAsString(report));
                    } catch (LpAppsException ex) {
                        logger.error("Failed to report discovery status: " + discoveryId, ex);
                    }


                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                DiscoveryStatusReport report = DiscoveryStatusReport.createErrorReport(discoveryId, false, dao);
                try {
                    Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(report));
                } catch (LpAppsException ex) {
                    logger.error("Failed to report discovery status: " + discoveryId, ex);
                }
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, DISCOVERY_POLLING_FREQUENCY_SECS, DISCOVERY_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            cancelDiscovery(discoveryId);
        };

        Application.SCHEDULER.schedule(canceller, DISCOVERY_TIMEOUT_MINS, MINUTES);
    }

    /**
     * Update discovery status in DB to finished, send report on sockets,
     * send cancel discovery call to actually stop it.
     *
     * Polling thread is still running until the actual Discovery status won't
     * be finished.
     */
    @Override
    public void cancelDiscovery(final String discoveryId) {
        Date finished = new Date();
        DiscoveryDao dao = null;
        for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
            d.setExecuting(false);
            d.setFinished(finished);
            discoveryRepository.save(d);
            dao = d;
        }
        DiscoveryStatusReport report = DiscoveryStatusReport.createErrorReport(discoveryId, true, dao);

        try {
            Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(report));
        } catch (LpAppsException ex) {
            logger.error("Failed to report discovery status: " + discoveryId, ex);
        }

        try {
            discoveryService.cancelDiscovery(discoveryId);
        } catch (LpAppsException ex) {
            logger.warn("Failed to cancel discovery " + discoveryId, ex);
        }
    }
}
