package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.EtlService;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExecutionController {

    private final EtlService etlService;

    public ExecutionController(ApplicationContext context) {
        etlService = context.getBean(EtlService.class);
    }

    /**
     * Get the result of a pipeline execution from the ETL service
     * @param executionIri
     * @return
     * @throws LpAppsException
     */
    @GetMapping("/api/execution/result")
    @ResponseBody
    public ResponseEntity<?> getResult(@NotNull @RequestParam(value = "executionIri") String executionIri) throws LpAppsException {
        String result = etlService.getExecutionResult(executionIri);
        return ResponseEntity.ok(result);
    }

}
