package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class ExecutionController {

    private final HttpUrlConnector httpUrlConnector;
    private final EtlServiceComponent etlService;

    public ExecutionController(){
        httpUrlConnector = new HttpUrlConnector();
        etlService = new EtlServiceComponent();
    }

    @RequestMapping("/execution/status")
    public ResponseEntity<?> getStatus(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        ExecutionStatus status = etlService.getExecutionStatus(executionIri);

        return ResponseEntity.ok(status);
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