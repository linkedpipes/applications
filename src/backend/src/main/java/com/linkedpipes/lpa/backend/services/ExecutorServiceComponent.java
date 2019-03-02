package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Wrapper to start discovery or execution while linking it on user
 * profile in the database.
 */
@Service
@Profile("!disableDB")
public class ExecutorServiceComponent implements ExecutorService {
    private final ApplicationContext context;

    private final DiscoveryService discoveryService;
    private final EtlService etlService;
    private final UserService userService;

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
        return discovery;
    }

    @Override
    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri, String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        this.userService.setUserDiscovery(userId, discovery.id);
        return discovery;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri, String userId) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri);
        return execution;
    }

}
