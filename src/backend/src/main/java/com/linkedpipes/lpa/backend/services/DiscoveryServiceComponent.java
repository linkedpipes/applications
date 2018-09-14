package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;

import java.io.IOException;

public class DiscoveryServiceComponent {

    private final HttpUrlConnector httpUrlConnector = new HttpUrlConnector();
    private final String discoveryServiceBaseUrl = Application.config.getProperty("discoveryServiceUrl");

    private String get(String url) throws IOException {
        return httpUrlConnector.sendGetRequest(url,
                null, "application/json");
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
}
