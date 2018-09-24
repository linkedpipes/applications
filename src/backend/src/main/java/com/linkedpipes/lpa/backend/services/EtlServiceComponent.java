package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.ExecutionResult;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;

import java.io.IOException;

public class EtlServiceComponent {
    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .create();
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
