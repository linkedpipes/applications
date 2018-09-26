package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.entities.ExecutionResult;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@SuppressWarnings("unused")
public class ExecutionController {

    private final EtlServiceComponent etlService;

    public ExecutionController(){
        etlService = new EtlServiceComponent();
    }

    @RequestMapping("/execution/status")
    public ResponseEntity<?> getStatus(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        ExecutionStatus status = etlService.getExecutionStatus(executionIri);

        return ResponseEntity.ok(status);
    }

    @RequestMapping("/execution/result")
    @ResponseBody
    public ResponseEntity<?> getResult(@RequestParam( value="executionIri") String executionIri) throws IOException{
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        ExecutionResult result = etlService.getExecutionResult(executionIri);

        return ResponseEntity.ok(result);
    }

}