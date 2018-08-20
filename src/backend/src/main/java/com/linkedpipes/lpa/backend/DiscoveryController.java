package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSourceList;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;

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
    public String startDiscovery(@RequestBody String discoveryConfig){
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return "Discovery config not provided";
        }

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
            return e.toString();
        }

        if (response.statusCode() != 200) {
            String errorMsg = response.statusCode() + ": " + response.body();
            logger.error(errorMsg);
            return errorMsg;
        }

        return response.body();
    }

    @RequestMapping("/discovery/{id}/status")
    public String getDiscoveryStatus(@PathVariable("id") String discoveryId){
        try {
            return httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId,
                    null, "application/json");
        } catch (IOException e) {
            logger.error("Exception: ", e);
        }
        return "Error";
    }

    @RequestMapping("/discovery/{id}/pipelineGroups")
    @ResponseBody
    public String getPipelineGroups(@PathVariable("id") String discoveryId){
        try {
            return httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/pipelines",
                    null, "application/json");

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "An error occurred.";
    }

}