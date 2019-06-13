package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.jetbrains.annotations.NotNull;

import java.util.List;

public interface DiscoveryService {

    Discovery startDiscoveryFromEndpoint(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri, @NotNull List<String> namedGraphs) throws LpAppsException;

    Discovery startDiscoveryFromInput(String discoveryConfig) throws LpAppsException;

    Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws LpAppsException;

    DiscoveryStatus getDiscoveryStatus(String discoveryId) throws LpAppsException;

    PipelineGroups getPipelineGroups(String discoveryId) throws LpAppsException;

    PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException;

    PipelineExportResult exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws LpAppsException;

    void cancelDiscovery(String discoveryId) throws LpAppsException;
}