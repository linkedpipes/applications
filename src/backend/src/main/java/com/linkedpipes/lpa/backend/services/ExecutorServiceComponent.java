package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.Application;
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

    private final int DISCOVERY_TIMEOUT_MINS = Application.getConfig().getInt("lpa.timeout.discoveryPollingTimeoutMins");
    private final int ETL_TIMEOUT_MINS = Application.getConfig().getInt("lpa.timeout.etlPollingTimeoutMins");
    private final int DISCOVERY_POLLING_FREQUENCY_SECS = Application.getConfig().getInt("lpa.timeout.discoveryPollingFrequencySecs");
    private final int ETL_POLLING_FREQUENCY_SECS = Application.getConfig().getInt("lpa.timeout.etlPollingFrequencySecs");

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

    @NotNull @Override
    public Discovery startDiscoveryFromInput(@NotNull String discoveryConfig, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        return startDiscoveryFromInput(discoveryConfig, userId, null, null, null);
    }

    @NotNull @Override
    public Discovery startDiscoveryFromInput(@NotNull String discoveryConfig, @NotNull String userId, @Nullable String sparqlEndpointIri, @Nullable String dataSampleIri, @Nullable List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInput(discoveryConfig);
        processStartedDiscovery(discovery.id, userId, sparqlEndpointIri, dataSampleIri, namedGraphs);
        return discovery;
    }

    @NotNull @Override
    public Discovery startDiscoveryFromInputIri(@NotNull String discoveryConfigIri, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        processStartedDiscovery(discovery.id, userId, null, null, null);
        return discovery;
    }

    private void processStartedDiscovery(String discoveryId, String userId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        this.userService.setUserDiscovery(userId, discoveryId, sparqlEndpointIri, dataSampleIri, namedGraphs);  //this inserts discovery in DB and sets flags
        notifyDiscoveryStarted(discoveryId, userId);
        startDiscoveryStatusPolling(discoveryId);
    }

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
            session.namedGraphs = d.getNamedGraphs();
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("discoveryAdded", OBJECT_MAPPER.writeValueAsString(session));
        }
    }

    @NotNull @Override
    public Execution executePipeline(@NotNull String etlPipelineIri, @NotNull String userId, @NotNull String selectedVisualiser) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri, etlPipelineIri, selectedVisualiser);  //this inserts execution in DB
        notifyExecutionStarted(execution.iri, userId);
        startEtlStatusPolling(execution.iri);
        return execution;
    }

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

    private void startEtlStatusPolling(String executionIri) throws LpAppsException {
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
                    EtlStatusReport report = new EtlStatusReport();
                    report.status = executionStatus;
                    report.error = false;
                    report.timeout = false;
                    report.executionIri = executionIri;
                    report.started = executionStatus.getStarted();
                    report.finished = executionStatus.getFinished();

                    if (pipeline != null) {
                        report.pipeline = new PipelineExportResult();
                        report.pipeline.pipelineId = pipeline.getPipelineId();
                        report.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
                        report.pipeline.resultGraphIri = pipeline.getResultGraphIri();
                    } else {
                        report.pipeline = null;
                    }

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
                EtlStatusReport report = new EtlStatusReport();
                report.status = null;
                report.error = true;
                report.timeout = false;
                report.executionIri = executionIri;
                report.started = -1;
                report.finished = -1;
                if (pipeline != null) {
                    report.pipeline = new PipelineExportResult();
                    report.pipeline.pipelineId = pipeline.getPipelineId();
                    report.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
                    report.pipeline.resultGraphIri = pipeline.getResultGraphIri();
                } else {
                    report.pipeline = null;
                }

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
                    EtlStatusReport report = new EtlStatusReport();
                    report.status = null;
                    report.error = true;
                    report.timeout = true;
                    report.executionIri = executionIri;
                    report.started = -1;
                    report.finished = -1;
                    PipelineInformationDao pipeline = e.getPipeline();
                    if (pipeline != null) {
                        report.pipeline = new PipelineExportResult();
                        report.pipeline.pipelineId = pipeline.getPipelineId();
                        report.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
                        report.pipeline.resultGraphIri = pipeline.getResultGraphIri();
                    } else {
                        report.pipeline = null;
                    }

                    try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", OBJECT_MAPPER.writeValueAsString(report));
                    } catch (LpAppsException ex) {
                        logger.error("Failed to report execution status: " + executionIri, ex);
                    }
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
            }
        };

        logger.info("Scheduling canceler to run in " + ETL_TIMEOUT_MINS + " minutes.");
        Application.SCHEDULER.schedule(canceller, ETL_TIMEOUT_MINS, MINUTES);
    }

    private void startDiscoveryStatusPolling(String discoveryId) throws LpAppsException {
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
                    DiscoveryStatusReport report = new DiscoveryStatusReport();
                    report.discoveryId = discoveryId;
                    report.status = discoveryStatus;
                    report.error = false;
                    report.timeout = false;
                    report.finished = finished.getTime() / 1000L;

                    if (dao != null) {
                        report.sparqlEndpointIri = dao.getSparqlEndpointIri();
                        report.dataSampleIri = dao.getDataSampleIri();
                        report.namedGraphs = dao.getNamedGraphs();
                    } else {
                        report.sparqlEndpointIri = null;
                        report.dataSampleIri = null;
                        report.namedGraphs = null;
                    }

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
                DiscoveryStatusReport report = new DiscoveryStatusReport();
                report.discoveryId = discoveryId;
                report.status = null;
                report.error = true;
                report.timeout = false;
                report.finished = -1;
                report.sparqlEndpointIri = null;
                report.dataSampleIri = null;
                report.namedGraphs = null;
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
            Date finished = new Date();
            DiscoveryDao dao = null;
            for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                d.setExecuting(false);
                d.setFinished(finished);
                discoveryRepository.save(d);
                dao = d;
            }
            DiscoveryStatusReport report = new DiscoveryStatusReport();
            report.discoveryId = discoveryId;
            report.status = null;
            report.error = false;
            report.timeout = true;
            if (dao != null) {
                report.sparqlEndpointIri = dao.getSparqlEndpointIri();
                report.dataSampleIri = dao.getDataSampleIri();
                report.namedGraphs = dao.getNamedGraphs();
            } else {
                report.sparqlEndpointIri = null;
                report.dataSampleIri = null;
                report.namedGraphs = null;
            }

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
        };

        Application.SCHEDULER.schedule(canceller, DISCOVERY_TIMEOUT_MINS, MINUTES);
    }
}
