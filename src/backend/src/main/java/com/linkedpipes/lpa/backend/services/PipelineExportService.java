package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

public interface PipelineExportService {
    PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException;
}
