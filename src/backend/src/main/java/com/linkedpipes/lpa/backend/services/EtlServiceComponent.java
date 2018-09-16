package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;

import java.io.IOException;

public class EtlServiceComponent {
    private final HttpUrlConnector httpUrlConnector = new HttpUrlConnector();
    private final String etlServiceBaseUrl = Application.config.getProperty("etlServiceUrl");

    private String get(String url) throws IOException {
        return httpUrlConnector.sendGetRequest(url,null, "application/json");
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
