package com.linkedpipes.lpa.backend;

import com.google.gson.Gson;
import com.linkedpipes.lpa.backend.entities.DataSourceList;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
public class DiscoveryController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testDiscoveryId = 1;
        return testDiscoveryId;
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws IOException{
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity("Discovery config not provided", HttpStatus.BAD_REQUEST);
        }

        String response =  httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                discoveryConfig, "text/plain", "application/json");

        Discovery newDiscovery = new Gson().fromJson(response, Discovery.class);

        return ResponseEntity.ok(newDiscovery);
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
    public ResponseEntity<String> getPipelineGroups(@PathVariable("id") String discoveryId) throws IOException{
        String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/pipeline-groups",
                null, "application/json");

        return ResponseEntity.ok(response);
    }

}