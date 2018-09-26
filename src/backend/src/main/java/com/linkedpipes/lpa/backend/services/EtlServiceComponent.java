package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.entities.ExecutionResult;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;

import java.io.IOException;

public class EtlServiceComponent {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .create();

    public String executePipeline(String etlPipelineIri) throws IOException {
        return new HttpRequestSender()
                .toEtl()
                .executePipeline(etlPipelineIri);
    }

    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = new HttpRequestSender()
                .toEtl()
                .getExecutionStatus(executionIri);
        return GSON.fromJson(response, ExecutionStatus.class);
    }

    public ExecutionResult getExecutionResult(String executionIri) throws IOException {
        String response = new HttpRequestSender()
                .toEtl()
                .getExecutionResult(executionIri);
        return GSON.fromJson(response, ExecutionResult.class);
    }

}
