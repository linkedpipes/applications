package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

public interface DiscoveryService {

    Discovery startDiscoveryFromInput(String discoveryConfig) throws LpAppsException;

    Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws LpAppsException;

    DiscoveryStatus getDiscoveryStatus(String discoveryId) throws LpAppsException;

    PipelineGroups getPipelineGroups(String discoveryId) throws LpAppsException;

    PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException;

    PipelineExportResult exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws LpAppsException;

    void cancelDiscovery(String discoveryId) throws LpAppsException;

}