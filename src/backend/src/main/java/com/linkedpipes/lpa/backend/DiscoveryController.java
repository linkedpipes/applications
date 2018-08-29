package com.linkedpipes.lpa.backend;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
public class DiscoveryController {

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testDiscoveryId = 1;
        return testDiscoveryId;
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws IOException{
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Discovery config not provided"), HttpStatus.BAD_REQUEST);
        }

        String response =  httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                discoveryConfig, "text/plain", "application/json");
        Discovery newDiscovery = new Gson().fromJson(response, Discovery.class);

        return ResponseEntity.ok(newDiscovery);
    }

    @RequestMapping("/pipelines/discoverFromInputIri")
    public ResponseEntity<?> startDiscoveryFromInputIri(@RequestParam( value="discoveryConfigIri") String discoveryConfigIri) throws IOException{
        if(discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Input IRI not provided"), HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInputIri",
                "?iri=" + discoveryConfigIri, "application/json");

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/discovery/{id}/status")
    public ResponseEntity<String> getDiscoveryStatus(@PathVariable("id") String discoveryId) throws IOException{
        String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId,
                null, "application/json");

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/discovery/{id}/pipelineGroups")
    @ResponseBody
    public ResponseEntity<Object> getPipelineGroups(@PathVariable("id") String discoveryId) throws IOException{
        String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/pipeline-groups",
                null, "application/json");

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

        return ResponseEntity.ok(pipelineGroups);
    }

}