package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;

import java.io.IOException;
import java.util.List;

public interface ExecutorService {

    Discovery startDiscoveryFromEndpoint(String userId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException;
    Discovery startDiscoveryFromInputIri(String rdfFileIri, String userId, String dataSampleIri) throws LpAppsException, UserNotFoundException, IOException;
    Discovery startDiscoveryFromInput(String rdfData, String userId, String dataSampleIri) throws LpAppsException, UserNotFoundException;
    Discovery startDiscoveryFromConfig(String discoveryConfig, String userId) throws LpAppsException, UserNotFoundException;
    Discovery startDiscoveryFromConfigIri(String discoveryConfigIri, String userId) throws LpAppsException, UserNotFoundException;
    Execution executePipeline(String etlPipelineIri, String userId, String selectedVisualiser) throws LpAppsException, UserNotFoundException;
    void cancelExecution(String executionIri);
    void cancelDiscovery(String discoveryId);
}
