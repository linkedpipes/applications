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
import jdk.jshell.spi.ExecutionControl;
/*import java.net.URI;
import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;
import static jdk.incubator.http.HttpRequest.BodyPublisher.fromString;*/

@RestController
public class DiscoveryController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    /*private static final HttpClient client = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();*/

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testDiscoveryId = 1;
        return testDiscoveryId;
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig){
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity("Discovery config not provided", HttpStatus.BAD_REQUEST);
        }

        try {
            String response =  httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                    discoveryConfig, "text/plain", "application/json");

            Discovery newDiscovery = new Gson().fromJson(response, Discovery.class);

            return ResponseEntity.ok(newDiscovery);
        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return new ResponseEntity("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);


        /*HttpResponse<String> response;

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

        return ResponseEntity.ok(response.body());*/
    }

    @RequestMapping("/pipelines/discoverFromInputIri")
    public ResponseEntity<String> startDiscoveryFromInputIri(@RequestBody String discoveryConfigIri){
        if(discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            return new ResponseEntity<>("Input IRI not provided", HttpStatus.BAD_REQUEST);
        }

        //TODO implement

        return new ResponseEntity("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping("/discovery/{id}/status")
    public ResponseEntity<String> getDiscoveryStatus(@PathVariable("id") String discoveryId){
        try {
            String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId,
                    null, "application/json");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return new ResponseEntity("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping("/discovery/{id}/pipelineGroups")
    @ResponseBody
    public ResponseEntity<String> getPipelineGroups(@PathVariable("id") String discoveryId){
        try {
            String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/pipelines",
                    null, "application/json");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return new ResponseEntity("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}