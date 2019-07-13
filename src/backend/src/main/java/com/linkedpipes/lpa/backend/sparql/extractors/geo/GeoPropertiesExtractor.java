package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.MarkerFilterSetup;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.sparql.queries.geo.GeoPropertiesQueryProvider;
import com.linkedpipes.lpa.backend.util.Streams;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.function.Consumer;

public class GeoPropertiesExtractor {

    @NotNull
    public MarkerFilterSetup extract(@NotNull QueryExecution queryExecution) {
        MarkerFilterSetup markerFilterSetup = new MarkerFilterSetup();

        Streams.sequentialFromIterator(queryExecution.execSelect())
                .forEach(extractInto(markerFilterSetup));

        return markerFilterSetup;
    }

    @NotNull
    private Consumer<? super QuerySolution> extractInto(@NotNull MarkerFilterSetup setup) {
        return solution -> {
            String predicateIri = solution.getResource(GeoPropertiesQueryProvider.VAR_P).getURI();
            String schemeIri = solution.getResource(GeoPropertiesQueryProvider.VAR_SCHEME).getURI();
            LocalizedValue conceptLabel = getLabel(solution, GeoPropertiesQueryProvider.CONCEPT_LABEL_VARIABLES);
            String conceptIri = solution.getResource(GeoPropertiesQueryProvider.VAR_CONCEPT).getURI();
            LocalizedValue schemeLabel = getLabel(solution, GeoPropertiesQueryProvider.SCHEME_LABEL_VARIABLES);

            setup.put(predicateIri, schemeIri, schemeLabel, conceptIri, conceptLabel);
        };
    }

    @NotNull
    private LocalizedValue getLabel(@NotNull QuerySolution solution, String[] labelVariables) {
        return Arrays.stream(labelVariables)
                .filter(solution::contains)
                .map(solution::getLiteral)
                .map(LocalizedValue::new)
                .reduce(LocalizedValue::withDefault)
                .orElseGet(LocalizedValue::new);
    }

}
