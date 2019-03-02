package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.DiscoveryStatus;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.linkedpipes.lpa.backend.entities.database.ExecutionRepository;
import com.linkedpipes.lpa.backend.entities.database.DiscoveryRepository;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;

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

    private final ApplicationContext context;

    private final DiscoveryService discoveryService;
    private final EtlService etlService;
    private final UserService userService;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    @Autowired
    private ExecutionRepository executionRepository;

    public ExecutorServiceComponent(ApplicationContext context) {
        this.context = context;
        this.discoveryService = context.getBean(DiscoveryService.class);
        this.etlService = context.getBean(EtlService.class);
        this.userService = context.getBean(UserService.class);
    }

    @Override
    public Discovery startDiscoveryFromInput(String discoveryConfig, String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInput(discoveryConfig);
        this.userService.setUserDiscovery(userId, discovery.id);
        startDiscoveryStatusPolling(discovery.id);
        return discovery;
    }

    @Override
    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri, String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        this.userService.setUserDiscovery(userId, discovery.id);
        startDiscoveryStatusPolling(discovery.id);
        return discovery;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri, String userId) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri);
        startEtlStatusPolling(execution.iri);
        return execution;
    }

    private void startEtlStatusPolling(String executionIri) throws LpAppsException {
        Runnable checker = () -> {
            try {
                ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);
                if (!executionStatus.status.isPollable()) {
                    Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", OBJECT_MAPPER.writeValueAsString(executionStatus));
                    for (com.linkedpipes.lpa.backend.entities.database.Execution e : executionRepository.findByExecutionIri(executionIri)) {
                        e.setStatus(executionStatus.status);
                    }

                    throw new RuntimeException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Crashed");
                throw new RuntimeException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, 10, 10, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Polling terminated");
            for (com.linkedpipes.lpa.backend.entities.database.Execution e : executionRepository.findByExecutionIri(executionIri)) {
                e.setStatus(EtlStatus.UNKNOWN);
            }
        };

        Application.SCHEDULER.schedule(canceller, 1, HOURS);
    }

    private void startDiscoveryStatusPolling(String discoveryId) throws LpAppsException {
        Runnable checker = () -> {
            try {
                DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);
                if (discoveryStatus.isFinished) {
                    logger.info("Reporting discovery finished in room " + discoveryId);
                    Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(discoveryStatus));
                    for (com.linkedpipes.lpa.backend.entities.database.Discovery d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                        d.setExecuting(false);
                    }

                    throw new RuntimeException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Crashed");
                throw new RuntimeException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, 10, 10, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Polling terminated");
            for (com.linkedpipes.lpa.backend.entities.database.Discovery d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                d.setExecuting(false);
            }
        };

        Application.SCHEDULER.schedule(canceller, 1, HOURS);
    }
}
