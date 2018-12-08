package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.services.EtlService;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@SuppressWarnings("unused")
public class ExecutionController {

    private final EtlService etlService;

    public ExecutionController(ApplicationContext context) {
        etlService = context.getBean(EtlService.class);
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