package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.ExecutionResult;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;

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

    private final String etlServiceBaseUrl = Application.config.getProperty("etlServiceUrl");

    private String get(String url) throws IOException {
        return HttpUrlConnector.sendGetRequest(url, null, "application/json");
    }

    public String executePipeline(String etlPipelineIri) throws IOException{
        return HttpUrlConnector.sendPostRequest(etlServiceBaseUrl + "/executions?pipeline=" + etlPipelineIri,
                null, "application/json", "application/json");
    }

    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = get(executionIri + "/overview");
        return GSON.fromJson(response, ExecutionStatus.class);
    }

    public ExecutionResult getExecutionResult(String executionIri) throws IOException {
        String response = get(executionIri);
        return GSON.fromJson(response, ExecutionResult.class);
    }
}
