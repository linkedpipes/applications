package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import java.io.IOException;
import java.util.ArrayList;

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

        Gson gson = new Gson();

        JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
        JsonObject pipelineGroupsJson = jsonObject.getAsJsonObject("pipelineGroups");
        JsonArray appGroups = pipelineGroupsJson.getAsJsonArray("applicationGroups");

        for (JsonElement appGroup : appGroups) {
            PipelineGroup pipelineGrp = new PipelineGroup();
            JsonObject appGroupObj = appGroup.getAsJsonObject();
            pipelineGrp.visualizers = gson.fromJson(appGroupObj.getAsJsonObject("applicationInstance"), ApplicationInstance.class);

            JsonArray dataSourceGroups = appGroupObj.getAsJsonArray("dataSourceGroups");

            for (JsonElement dataSourceGroup : dataSourceGroups) {
                DataSourceGroup dataSrcGroup = new DataSourceGroup();
                JsonArray datasourceInstances = dataSourceGroup.getAsJsonObject().getAsJsonArray("dataSourceInstances");
                dataSrcGroup.dataSources = gson.fromJson(datasourceInstances, new TypeToken<ArrayList<DataSource>>(){}.getType());

                JsonArray extractorGroups = dataSourceGroup.getAsJsonObject().getAsJsonArray("extractorGroups");

                for (JsonElement extractorGroup : extractorGroups) {
                    JsonArray dataSampleGroups = extractorGroup.getAsJsonObject().getAsJsonArray("dataSampleGroups");

                    for (JsonElement dataSampleGroup : dataSampleGroups) {
                        Pipeline pipeline = gson.fromJson(dataSampleGroup.getAsJsonObject().getAsJsonObject("pipeline"), Pipeline.class);
                        dataSrcGroup.pipelines.add(pipeline);
                    }
                }

                pipelineGrp.dataSourceGroups.add(dataSrcGroup);
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
                .exportPipelineUsingSD(discoveryId, pipelineUri, new Gson().toJson(serviceDescription));
    }

}
