package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.util.TriFunction;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static com.linkedpipes.lpa.backend.util.Memoizer.memoize;

@RestController
public class DataSourceController {

    @NotNull
    private static final String TEMPLATE_DESCRIPTION_PATH = "/api/datasources/template";

    @NotNull
    private static final String SPARQL_ENDPOINT_IRI_PARAM = DiscoveryController.SPARQL_ENDPOINT_IRI_PARAM;
    @NotNull
    private static final String DATA_SAMPLE_IRI_PARAM = DiscoveryController.DATA_SAMPLE_IRI_PARAM;
    @NotNull
    private static final String NAMED_GRAPHS_PARAM = DiscoveryController.NAMED_GRAPHS_PARAM;

    @NotNull
    private final TriFunction<String, String, List<String>, ResponseEntity<String>> memoizedGetTemplateDescription = memoize(this::doGetTemplateDescription);

    /**
     * Returns a data source template description readable by Discovery.
     *
     * @param sparqlEndpointIri the desired endpoint IRI for the default SPARQL service described in the output
     * @param dataSampleIri     the IRI of the data sample describing the data in the data source
     * @param namedGraphs       the named graphs specified for the SPARQL endpoint
     * @return a data source template
     */
    @GetMapping(TEMPLATE_DESCRIPTION_PATH)
    public ResponseEntity<String> getTemplateDescription(@NotNull @RequestParam(SPARQL_ENDPOINT_IRI_PARAM) String sparqlEndpointIri,
                                                         @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri,
                                                         @Nullable @RequestParam(NAMED_GRAPHS_PARAM) List<String> namedGraphs) {
        if(namedGraphs == null)
            namedGraphs = new ArrayList<>();

        return memoizedGetTemplateDescription.apply(sparqlEndpointIri, dataSampleIri, namedGraphs);
    }

    private ResponseEntity<String> doGetTemplateDescription(@NotNull String sparqlEndpointIri,
                                                            @NotNull String dataSampleIri,
                                                            @Nullable List<String> namedGraphs) {
        return ResponseEntity.ok(TtlGenerator.getTemplateDescription(sparqlEndpointIri, dataSampleIri, namedGraphs));
    }

}
