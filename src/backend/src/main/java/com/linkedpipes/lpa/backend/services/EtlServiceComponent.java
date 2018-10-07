package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;

import java.io.IOException;
import java.util.Map;

public class EtlServiceComponent {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .create();

    private static final Map<String, String> EXECUTION_STATUS = Map.of(
            "http://etl.linkedpipes.com/resources/status/failed", "FAILED",
            "http://etl.linkedpipes.com/resources/status/queued", "QUEUED",
            "http://etl.linkedpipes.com/resources/status/running", "RUNNING",
            "http://etl.linkedpipes.com/resources/status/finished", "FINISHED",
            "http://etl.linkedpipes.com/resources/status/cancelled", "CANCELLED",
            "http://etl.linkedpipes.com/resources/status/cancelling", "CANCELLING"
    );

    public Execution executePipeline(String etlPipelineIri) throws IOException {
        String response = new HttpRequestSender()
                .toEtl()
                .executePipeline(etlPipelineIri);
        return GSON.fromJson(response, Execution.class);
    }

    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = new HttpRequestSender()
                .toEtl()
                .getExecutionStatus(executionIri);
        return GSON.fromJson(response, ExecutionStatus.class);
    }

    public String getExecutionResult(String executionIri) throws IOException {
        return new HttpRequestSender()
                .toEtl()
                .getExecutionResult(executionIri);
    }

}
