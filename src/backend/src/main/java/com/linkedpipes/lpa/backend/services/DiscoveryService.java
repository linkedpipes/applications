package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;

import java.io.IOException;

public interface DiscoveryService {

    Discovery startDiscoveryFromInput(String discoveryConfig) throws IOException;

    Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws IOException;

    String getDiscoveryStatus(String discoveryId) throws IOException;

    PipelineGroups getPipelineGroups(String discoveryId) throws IOException;

    PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws IOException;

    PipelineExportResult exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws IOException;

    String getVirtuosoServiceDescription(String graphName);

}
