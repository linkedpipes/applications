package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.profile.DiscoverySession;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import org.apache.jena.riot.Lang;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ExecutorService {

    DiscoverySession startDiscoveryFromEndpoint(String userId, long discoveryId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException;
    DiscoverySession startDiscoveryFromInputIri(String rdfFileIri, String userId, String dataSampleIri) throws LpAppsException, IOException;
    DiscoverySession startDiscoveryFromInput(String rdfData, Lang rdfLanguage, String userId, String dataSampleIri) throws LpAppsException, UserNotFoundException;
    DiscoverySession startDiscoveryFromInputFiles(MultipartFile rdfFile, MultipartFile dataSampleFile, String userId) throws LpAppsException, IOException;
    DiscoverySession startDiscoveryFromConfig(String discoveryConfig, String userId) throws LpAppsException, UserNotFoundException;
    DiscoverySession startDiscoveryFromConfigIri(String discoveryConfigIri, String userId) throws LpAppsException, UserNotFoundException;
    Execution executePipeline(String etlPipelineIri, String userId, String selectedVisualiser, boolean startedByUser) throws LpAppsException, UserNotFoundException;
    void cancelExecution(String executionIri);
    void cancelDiscovery(String discoveryId);
}
