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

    public static final String TEMPLATE_DESCRIPTION_PATH = "/api/datasources/template";

    public static final String SPARQL_ENDPOINT_IRI_PARAM = "sparqlEndpointIri";
    public static final String DATA_SAMPLE_IRI_PARAM = "dataSampleIri";
    public static final String GRAPH_NAME_PARAM = "graphName";

    @GetMapping(TEMPLATE_DESCRIPTION_PATH)
    public ResponseEntity<String> getTemplateDescription(@NotNull @RequestParam(SPARQL_ENDPOINT_IRI_PARAM) String sparqlEndpointIri,
                                                         @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri,
                                                         @Nullable @RequestParam(name = GRAPH_NAME_PARAM, required = false) String graphName) {
        return ResponseEntity.ok(TtlGenerator.getTemplateDescription(sparqlEndpointIri, dataSampleIri, graphName));
    }
    
}
