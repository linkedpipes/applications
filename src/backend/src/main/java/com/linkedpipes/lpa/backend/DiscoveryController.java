package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSourceList;
import com.linkedpipes.lpa.backend.helpers.StreamHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class DiscoveryController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

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

            URL url = new URL(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Content-Type", "text/plain");
            conn.setDoOutput(true);

            DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
            wr.writeBytes(discoveryConfig);
            wr.flush();
            wr.close();

            conn.connect();

            if (conn.getResponseCode() != 200) {
                String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                        + StreamHelper.getStringFromStream(conn.getErrorStream());
                logger.error(errorMsg);
                return errorMsg;
            }

            String response = StreamHelper.getStringFromStream(conn.getInputStream());
            conn.disconnect();
            return response;

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "Error";
    }

    @RequestMapping("/discovery/{id}/status")
    public String getDiscoveryStatus(@PathVariable("id") String discoveryId){
        try {
            URL url = new URL(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            conn.connect();

            if (conn.getResponseCode() != 200) {
                String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                        + StreamHelper.getStringFromStream(conn.getErrorStream());
                logger.error(errorMsg);
                return errorMsg;
            }

            String response = StreamHelper.getStringFromStream(conn.getInputStream());

            conn.disconnect();
            return response;

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }
        return "Error";
    }

    @RequestMapping("/discovery/{id}/pipelineGroups")
    @ResponseBody
    public String getPipelineGroups(@PathVariable("id") String discoveryId){
        try {
            URL url = new URL(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/pipelines");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            conn.connect();

            if (conn.getResponseCode() != 200) {
                String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                        + StreamHelper.getStringFromStream(conn.getErrorStream());
                logger.error(errorMsg);
                return errorMsg;
            }

            String response = StreamHelper.getStringFromStream(conn.getInputStream());

            conn.disconnect();
            return response;

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "An error occurred.";
    }

}