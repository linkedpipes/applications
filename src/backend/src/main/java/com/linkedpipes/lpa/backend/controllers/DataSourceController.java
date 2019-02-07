package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.services.TtlGenerator;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SuppressWarnings("unused")
public class DataSourceController {

    @GetMapping("/api/datasources/template")
    public ResponseEntity<String> getTemplateDescription(@NotNull @RequestParam("sparqlEndpointUrl") String sparqlEndpointUrl,
                                                         @NotNull@RequestParam("dataSampleUrl") String dataSampleUrl,
                                                         @Nullable @RequestParam(name = "graphName", required = false) String graphName) {
        return ResponseEntity.ok(TtlGenerator.getTemplateDescription(sparqlEndpointUrl, dataSampleUrl, graphName));
    }
    
}
