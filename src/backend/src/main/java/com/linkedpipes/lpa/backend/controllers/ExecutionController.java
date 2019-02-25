package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.EtlService;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SuppressWarnings("unused")
public class ExecutionController {

    private final EtlService etlService;

    public ExecutionController(ApplicationContext context) {
        etlService = context.getBean(EtlService.class);
    }

    @GetMapping("/api/execution/status")
    public ResponseEntity<?> getStatus(@RequestParam(value = "executionIri") String executionIri) throws LpAppsException {
        if(executionIri == null || executionIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Execution IRI not provided.");
        }

        String status = etlService.getExecutionStatus(executionIri);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/api/execution/result")
    @ResponseBody
    public ResponseEntity<?> getResult(@RequestParam(value = "executionIri") String executionIri) throws LpAppsException {
        if(executionIri == null || executionIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Execution IRI not provided.");
        }

        String result = etlService.getExecutionResult(executionIri);
        return ResponseEntity.ok(result);
    }

}
