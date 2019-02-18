package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.util.TriFunction;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.linkedpipes.lpa.backend.util.Memoizer.memoize;

@RestController
@SuppressWarnings("unused")
public class DataSourceController {

    @NotNull
    public static final String TEMPLATE_DESCRIPTION_PATH = "/api/datasources/template";

    @NotNull
    private static final String SPARQL_ENDPOINT_IRI_PARAM = DiscoveryController.SPARQL_ENDPOINT_IRI_PARAM;
    @NotNull
    private static final String DATA_SAMPLE_IRI_PARAM = DiscoveryController.DATA_SAMPLE_IRI_PARAM;
    @NotNull
    private static final String NAMED_GRAPH_PARAM = DiscoveryController.NAMED_GRAPH_PARAM;

    @NotNull
    private final TriFunction<String, String, String, ResponseEntity<String>> memoizedGetTemplateDescription = memoize(this::doGetTemplateDescription);

    @GetMapping(TEMPLATE_DESCRIPTION_PATH)
    public ResponseEntity<String> getTemplateDescription(@NotNull @RequestParam(SPARQL_ENDPOINT_IRI_PARAM) String sparqlEndpointIri,
                                                         @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri,
                                                         @Nullable @RequestParam(value = NAMED_GRAPH_PARAM, required = false) String namedGraph) {
        return memoizedGetTemplateDescription.apply(sparqlEndpointIri, dataSampleIri, namedGraph);
    }

    private ResponseEntity<String> doGetTemplateDescription(@NotNull String sparqlEndpointIri,
                                                            @NotNull String dataSampleIri,
                                                            @Nullable String namedGraph) {
        return ResponseEntity.ok(TtlGenerator.getTemplateDescription(sparqlEndpointIri, dataSampleIri, namedGraph));
    }

}
