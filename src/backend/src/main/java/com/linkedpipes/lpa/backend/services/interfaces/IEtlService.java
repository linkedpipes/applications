package com.linkedpipes.lpa.backend.services.interfaces;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

public interface IEtlService {
    Execution executePipeline(String etlPipelineIri) throws LpAppsException;

    ExecutionStatus getExecutionStatus(String executionIri) throws LpAppsException;

    String getExecutionResult(String executionIri) throws LpAppsException;
}
