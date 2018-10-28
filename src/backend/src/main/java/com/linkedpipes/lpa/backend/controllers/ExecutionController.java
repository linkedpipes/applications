package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@SuppressWarnings("unused")
public class ExecutionController {

    private final EtlServiceComponent etlService;

    public ExecutionController(){
        etlService = new EtlServiceComponent();
    }

    @GetMapping("/api/execution/status")
    public ResponseEntity<?> getStatus(@RequestParam(value = "executionIri") String executionIri) throws IOException {
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        ExecutionStatus status = etlService.getExecutionStatus(executionIri);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/api/execution/result")
    @ResponseBody
    public ResponseEntity<?> getResult(@RequestParam(value = "executionIri") String executionIri) throws IOException {
        if(executionIri == null || executionIri.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Execution IRI not provided."), HttpStatus.BAD_REQUEST);
        }

        String result = etlService.getExecutionResult(executionIri);
        return ResponseEntity.ok(result);
    }

}