package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;

import java.io.IOException;

public class EtlServiceComponent {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .create();

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
