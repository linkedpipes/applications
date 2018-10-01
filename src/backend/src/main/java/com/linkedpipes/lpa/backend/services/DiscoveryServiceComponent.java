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

        PipelineGroups pipelineGroups = new PipelineGroups();

        JsonObject jsonObject = new Gson().fromJson(response, JsonObject.class);
        JsonObject pipelineGroupsJson = jsonObject.getAsJsonObject("pipelineGroups");
        JsonArray appGroups = pipelineGroupsJson.getAsJsonArray("applicationGroups");

        for (JsonElement appGroup : appGroups) {
            PipelineGroup pipelineGrp = new PipelineGroup();
            JsonObject appGroupObj = appGroup.getAsJsonObject();
            pipelineGrp.applicationInstance = new Gson().fromJson(appGroupObj.getAsJsonObject("applicationInstance"), ApplicationInstance.class);

            JsonArray dataSourceGroups = appGroupObj.getAsJsonArray("dataSourceGroups");

            for (JsonElement dataSourceGroup : dataSourceGroups) {
                JsonArray extractorGroups = dataSourceGroup.getAsJsonObject().getAsJsonArray("extractorGroups");

                for (JsonElement extractorGroup : extractorGroups) {
                    JsonArray dataSampleGroups = extractorGroup.getAsJsonObject().getAsJsonArray("dataSampleGroups");

                    for (JsonElement dataSampleGroup : dataSampleGroups) {
                        Pipeline pipeline = new Gson().fromJson(dataSampleGroup.getAsJsonObject().getAsJsonObject("pipeline"), Pipeline.class);
                        pipelineGrp.pipelines.add(pipeline);
                    }
                }
            }
            pipelineGroups.pipelineGroups.add(pipelineGrp);
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
