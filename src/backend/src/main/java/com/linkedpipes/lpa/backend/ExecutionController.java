package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.helpers.StreamHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class ExecutionController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    @RequestMapping("/execution/status")
    public String getStatus(@RequestParam( value="executionIri") String executionIri){
        if(executionIri == null || executionIri.isEmpty()) {
            return "Execution IRI not provided.";
        }

        try {
            URL url = new URL(executionIri + "/overview");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

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

    @RequestMapping("/execution/result")
    @ResponseBody
    public String getResult(@RequestParam( value="executionIri") String executionIri){
        if(executionIri == null || executionIri.isEmpty()) {
            return "Execution IRI not provided.";
        }

        try {
            URL url = new URL(executionIri);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

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

}