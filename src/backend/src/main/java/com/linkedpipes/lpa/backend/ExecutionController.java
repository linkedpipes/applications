package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class ExecutionController {

    private HttpUrlConnector httpUrlConnector = new HttpUrlConnector();

    @RequestMapping("/execution/status")
    public ResponseEntity<?> getStatus(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(executionIri + "/overview",
                null, "application/json");

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/execution/result")
    @ResponseBody
    public ResponseEntity<?> getResult(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(executionIri,
                null, "application/json");

        return ResponseEntity.ok(response);
    }

}