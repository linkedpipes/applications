package com.linkedpipes.lpa.backend;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.linkedpipes.lpa.backend.entities.DataSourceList;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.URI;


import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;
import static jdk.incubator.http.HttpRequest.BodyPublisher.fromString;

@RestController
public class DiscoveryController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    private static final HttpClient client = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testDiscoveryId = 1;
        return testDiscoveryId;
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig){
        HttpResponse<String> response;

        try {
            URI requestUri = new URI(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput");
            HttpRequest request = HttpRequest.newBuilder(requestUri)
                    .header("Accept", "application/json")
                    .header("Content-Type", "text/plain")
                    .POST(fromString(discoveryConfig))
                    .build();
            response = client.send(request, HttpResponse.BodyHandler.asString());
        } catch (Exception e) {
            logger.error("Exception: ", e);
            return new ResponseEntity(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (response.statusCode() != 200) {
            String errorMsg = response.statusCode() + ": " + response.body();
            logger.error(errorMsg);
            return new ResponseEntity(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok(response.body());
    }

    @RequestMapping("/pipelines/discoverFromInputIri")
    public ResponseEntity<String> startDiscoveryFromInputIri(@RequestParam( value="discoveryConfigIri") String discoveryConfigIri) throws IOException{
        if(discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            return new ResponseEntity("Input IRI not provided", HttpStatus.BAD_REQUEST);
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