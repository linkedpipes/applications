package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.PollingCompletedException;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;

import org.jetbrains.annotations.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
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
        Discovery discovery = this.discoveryService.startDiscoveryFromInput(discoveryConfig);
        this.userService.setUserDiscovery(userId, discovery.id);  //this inserts discovery in DB and sets flags
        startDiscoveryStatusPolling(discovery.id);
        return discovery;
    }

    @NotNull @Override
    public Discovery startDiscoveryFromInputIri(@NotNull String discoveryConfigIri, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        this.userService.setUserDiscovery(userId, discovery.id);  //this inserts discovery in DB and sets flags
        startDiscoveryStatusPolling(discovery.id);
        return discovery;
    }

    @NotNull @Override
    public Execution executePipeline(@NotNull String etlPipelineIri, @NotNull String userId, @NotNull String selectedVisualiser) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri, selectedVisualiser);  //this inserts execution in DB
        startEtlStatusPolling(execution.iri);
        return execution;
    }

    private void startEtlStatusPolling(String executionIri) throws LpAppsException {
        Runnable checker = () -> {
            try {
                ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);

                //persist status in DB
                for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                    e.setStatus(executionStatus.status);
                    executionRepository.save(e);
                }

                if (!executionStatus.status.isPollable()) {
                    Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", OBJECT_MAPPER.writeValueAsString(executionStatus));
                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                logger.error("Got exception when polling for ETL status.", e);
                Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Crashed");
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, ETL_POLLING_FREQUENCY_SECS, ETL_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                if (e.getStatus() != EtlStatus.FINISHED) {
                    logger.info("Cancelling execution");
                    Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Polling terminated");
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

        logger.info("Scheduling canceler to run in " + ETL_TIMEOUT_MINS + " seconds.");
        Application.SCHEDULER.schedule(canceller, ETL_TIMEOUT_MINS, SECONDS);
    }

    private void startDiscoveryStatusPolling(String discoveryId) throws LpAppsException {
        Runnable checker = () -> {
            try {
                DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);

                if (discoveryStatus.isFinished) {
                    logger.info("Reporting discovery finished in room " + discoveryId);
                    Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(discoveryStatus));
                    for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                        d.setExecuting(false);
                        discoveryRepository.save(d);
                    }

                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Crashed");
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, DISCOVERY_POLLING_FREQUENCY_SECS, DISCOVERY_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Polling terminated");
            try {
                discoveryService.cancelDiscovery(discoveryId);
            } catch (LpAppsException ex) {
                logger.warn("Failed to cancel discovery " + discoveryId, ex);
            }
            for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                d.setExecuting(false);
                discoveryRepository.save(d);
            }
        };

        Application.SCHEDULER.schedule(canceller, DISCOVERY_TIMEOUT_MINS, MINUTES);
    }
}
