package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;

import java.io.IOException;
import java.util.ArrayList;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of Discovery-related backend operations of the application.
 */
public class DiscoveryServiceComponent {

    public Discovery startDiscoveryFromInput(String discoveryConfig) throws IOException {
        String response = HttpActions.startFromInput(discoveryConfig);
        return new Gson().fromJson(response, Discovery.class);
    }

    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws IOException {
        String response = HttpActions.startFromInputIri(discoveryConfigIri);
        return new Gson().fromJson(response, Discovery.class);
    }

    // TODO strongly type below method params (not simply string)
    public String getDiscoveryStatus(String discoveryId) throws IOException{
        return HttpActions.getStatus(discoveryId);
    }

    public PipelineGroups getPipelineGroups(String discoveryId) throws IOException {
        String response = HttpActions.getPipelineGroups(discoveryId);

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
        String response = HttpActions.exportPipeline(discoveryId, pipelineUri);
        return new Gson().fromJson(response, PipelineExportResult.class);
    }

    public String exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws IOException {
        return HttpActions.exportPipelineUsingSD(discoveryId, pipelineUri, new Gson().toJson(serviceDescription));
    }

    private static class HttpActions {

        private static final String URL_BASE = Application.getConfig().getProperty("discoveryServiceUrl");
        private static final String URL_START_FROM_INPUT = urlFrom(URL_BASE, "discovery", "startFromInput");
        private static final String URL_START_FROM_INPUT_IRI = urlFrom(URL_BASE, "discovery", "startFromInputIri");
        private static final String URL_GET_STATUS = urlFrom(URL_BASE, "discovery", "%s");
        private static final String URL_GET_PIPELINE_GROUPS = urlFrom(URL_BASE, "discovery", "%s", "pipeline-groups");
        private static final String URL_EXPORT_PIPELINE = urlFrom(URL_BASE, "discovery", "%s", "export", "%s");

        private static String startFromInput(String discoveryConfig) throws IOException {
            return new HttpRequestSender().to(URL_START_FROM_INPUT)
                    .method(HttpRequestSender.HttpMethod.POST)
                    .requestBody(discoveryConfig)
                    .contentType("text/plain")
                    .acceptType("application/json")
                    .send();
        }

        private static String startFromInputIri(String discoveryConfigIri) throws IOException {
            return new HttpRequestSender().to(URL_START_FROM_INPUT_IRI)
                    .parameter("iri", discoveryConfigIri)
                    .acceptType("application/json")
                    .send();
        }

        private static String getStatus(String discoveryId) throws IOException {
            return new HttpRequestSender().to(String.format(URL_GET_STATUS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        private static String getPipelineGroups(String discoveryId) throws IOException {
            return new HttpRequestSender().to(String.format(URL_GET_PIPELINE_GROUPS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        private static String exportPipeline(String discoveryId, String pipelineUri) throws IOException {
            return new HttpRequestSender().to(String.format(URL_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .acceptType("application/json")
                    .send();
        }

        private static String exportPipelineUsingSD(String discoveryId, String pipelineUri, String serviceDescription) throws IOException {
            return new HttpRequestSender().to(String.format(URL_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .method(HttpRequestSender.HttpMethod.POST)
                    .requestBody(serviceDescription)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

    }

}
