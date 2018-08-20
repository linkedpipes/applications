package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSourceList;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.*;

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
    public String startDiscovery(@RequestBody String discoveryConfig){
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return "Discovery config not provided";
        }

        try {
            return httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                    discoveryConfig, "text/plain", "application/json");

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "Error";
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