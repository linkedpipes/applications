package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;

import java.util.List;

public interface ExecutorService {

    Discovery startDiscoveryFromInput(String discoveryConfig, String userId) throws LpAppsException, UserNotFoundException;
    Discovery startDiscoveryFromInput(String discoveryConfig, String userId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException;
    Discovery startDiscoveryFromInputIri(String discoveryConfigIri, String userId) throws LpAppsException, UserNotFoundException;
    Execution executePipeline(String etlPipelineIri, String userId, String selectedVisualiser) throws LpAppsException, UserNotFoundException;

}
