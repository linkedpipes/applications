package com.linkedpipes.lpa.backend.services;

import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;

import java.io.IOException;

public class EtlServiceComponent {
    private final HttpUrlConnector httpUrlConnector = new HttpUrlConnector();
    private final String etlServiceBaseUrl = Application.config.getProperty("etlServiceUrl");

    private String get(String url) throws IOException {
        return httpUrlConnector.sendGetRequest(url,null, "application/json");
    }

    public String executePipeline(String etlPipelineIri) throws IOException{
        return httpUrlConnector.sendPostRequest(etlServiceBaseUrl + "/executions?pipeline=" + etlPipelineIri,
                null, "application/json", "application/json");
    }

    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = get(executionIri + "/overview");
        return new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
                .create().fromJson(response, ExecutionStatus.class);
    }

    public String getExecutionResult(String executionIri) throws IOException {
        String response = get(executionIri);

        return response;
    }
}
