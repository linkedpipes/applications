package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class ExecutionController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    @RequestMapping("/execution/status")
    public ResponseEntity<String> getStatus(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity("Execution IRI not provided.", HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(executionIri + "/overview",
                null, "application/json");

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/execution/result")
    @ResponseBody
    public ResponseEntity<String> getResult(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity("Execution IRI not provided.", HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(executionIri,
                null, "application/json");

        return ResponseEntity.ok(response);
    }

}