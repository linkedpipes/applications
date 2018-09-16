package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import org.apache.jena.atlas.io.IO;

import java.io.IOException;

public class DiscoveryServiceComponent {

    private final HttpUrlConnector httpUrlConnector = new HttpUrlConnector();
    private final String discoveryServiceBaseUrl = Application.config.getProperty("discoveryServiceUrl");

    private String get(String url) throws IOException {
        return httpUrlConnector.sendGetRequest(url,
                null, "application/json");
    }

    public Discovery startDiscoveryFromInput(String discoveryConfig) throws IOException{
        String response =  httpUrlConnector.sendPostRequest(discoveryServiceBaseUrl + "/discovery/startFromInput",
                discoveryConfig, "text/plain", "application/json");

        return new Gson().fromJson(response, Discovery.class);
    }

    //TODO strongly type below method params (not simply string)
    //TODO use better string interpolation method?
    public String getDiscoveryStatus(String discoveryId) throws IOException{
        return get(discoveryServiceBaseUrl + "/discovery/" + discoveryId);
    }

    public PipelineGroups getPipelineGroups(String discoveryId) throws IOException{
        String response = get(discoveryServiceBaseUrl + "/discovery/" + discoveryId + "/pipeline-groups");

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

    public String exportPipeline(String discoveryId, String pipelineUri) throws IOException {
        return httpUrlConnector.sendGetRequest(discoveryServiceBaseUrl + "/discovery/" + discoveryId + "/export/" + pipelineUri,
                null, "application/json");
    }

    public String exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws IOException {
        return httpUrlConnector.sendPostRequest(discoveryServiceBaseUrl + "/discovery/" + discoveryId + "/export/" + pipelineUri,
                new Gson().toJson(serviceDescription), "application/json", "application/json");
    }
}
