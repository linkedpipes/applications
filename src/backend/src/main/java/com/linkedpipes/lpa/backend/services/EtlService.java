package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

public interface EtlService {
    Execution executePipeline(String etlPipelineIri) throws LpAppsException;
    ExecutionStatus getExecutionStatus(String executionIri) throws LpAppsException;
    String getExecutionResult(String executionIri) throws LpAppsException;
    void cancelExecution(String executionIri) throws LpAppsException;
    Execution executeDataSamplePipeline(String sparqlEndpointIri, String namedGraph) throws LpAppsException;
}
