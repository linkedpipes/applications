package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class ExecutionController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    @RequestMapping("/execution/status")
    public String getStatus(@RequestParam( value="executionIri") String executionIri){
        if(executionIri == null || executionIri.isEmpty()) {
            return "Execution IRI not provided.";
        }

        try {
            return httpUrlConnector.sendGetRequest(executionIri + "/overview",
                    null, "application/json");
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
            return httpUrlConnector.sendGetRequest(executionIri,
                    null, "application/json");
        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "Error";
    }

}