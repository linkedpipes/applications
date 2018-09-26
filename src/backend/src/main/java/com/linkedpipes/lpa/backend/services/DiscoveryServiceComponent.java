package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;

import java.io.IOException;

public class DiscoveryServiceComponent {

    public Discovery startDiscoveryFromInput(String discoveryConfig) throws IOException {
        String response = new HttpRequestSender().toDiscovery().startFromInput(discoveryConfig);
        return new Gson().fromJson(response, Discovery.class);
    }

    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws IOException {
        String response = new HttpRequestSender().toDiscovery().startFromInputIri(discoveryConfigIri);
        return new Gson().fromJson(response, Discovery.class);
    }

    //TODO strongly type below method params (not simply string)
    //TODO use better string interpolation method?
    public String getDiscoveryStatus(String discoveryId) throws IOException{
        return new HttpRequestSender()
                .toDiscovery()
                .getStatus(discoveryId);
    }

    public PipelineGroups getPipelineGroups(String discoveryId) throws IOException {
        String response = new HttpRequestSender()
                .toDiscovery()
                .getPipelineGroups(discoveryId);

        JsonObject jsonObject = new Gson().fromJson(response, JsonObject.class);
        JsonObject pipelineGroupsJson = jsonObject.getAsJsonObject("pipelineGroups");
        JsonArray pipelines = pipelineGroupsJson.getAsJsonArray("pipelines");

        PipelineGroups pipelineGroups = new PipelineGroups();

        for (JsonElement pipeline : pipelines) {
            JsonArray pipelineArray = pipeline.getAsJsonArray();
            Pipeline pipelineObj = new Pipeline();
            pipelineObj.id = pipelineArray.get(0).getAsString();
            pipelineObj.name = pipelineArray.get(1).getAsJsonObject().get("name").getAsString();
            pipelineObj.descriptor = pipelineArray.get(1).getAsJsonObject().get("descriptor").getAsString();
            pipelineGroups.pipelines.add(pipelineObj);
        }

        return pipelineGroups;
    }

    public PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws IOException {
        String response = new HttpRequestSender()
                .toDiscovery()
                .exportPipeline(discoveryId, pipelineUri);
        return new Gson().fromJson(response, PipelineExportResult.class);
    }

    public String exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws IOException {
        return new HttpRequestSender()
                .toDiscovery()
                .exportPipelineUsingSD(discoveryId, pipelineUri, serviceDescription);
    }

}
