package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;

import java.io.IOException;

public interface EtlService {
    Execution executePipeline(String etlPipelineIri) throws IOException;

    ExecutionStatus getExecutionStatus(String executionIri) throws IOException;

    String getExecutionResult(String executionIri) throws IOException;
}
