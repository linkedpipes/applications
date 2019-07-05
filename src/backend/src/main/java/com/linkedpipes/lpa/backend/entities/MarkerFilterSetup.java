package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.HashMap;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.ANY;

@JsonAutoDetect(fieldVisibility = ANY)
public class MarkerFilterSetup {

    private Map<String, Map<String, Scheme>> filters; // (predicate IRI) -> (schemeIRI) -> (Scheme)

    public MarkerFilterSetup put(@NotNull String predicateIri,
                                 @NotNull String schemeIri, @NotNull LocalizedValue schemeLabel,
                                 @NotNull String conceptIri, @NotNull LocalizedValue conceptLabel) {
        if (filters == null) {
            filters = new HashMap<>();
        }

        Map<String, Scheme> predicate = filters.computeIfAbsent(predicateIri, s -> new HashMap<>());
        Scheme scheme = predicate.get(schemeIri);

        if (scheme == null) {
            scheme = new Scheme(schemeLabel);
            predicate.put(schemeIri, scheme);
        } else {
            scheme.schemeLabel.withDefault(schemeLabel);
        }

        scheme.put(conceptIri, conceptLabel);
        return this;
    }

    @JsonAutoDetect(fieldVisibility = ANY)
    public static class Scheme {

        @NotNull
        LocalizedValue schemeLabel;
        @Nullable
        private Map<String, LocalizedValue> concepts; // (concept IRI) -> (concept label)

        Scheme(@NotNull LocalizedValue schemeLabel) {
            this.schemeLabel = schemeLabel;
        }

        @NotNull
        Scheme put(@NotNull String conceptIri, @NotNull LocalizedValue conceptLabel) {
            if (concepts == null) {
                concepts = new HashMap<>();
            }

            LocalizedValue oldConceptLabel = concepts.get(conceptIri);
            if (oldConceptLabel == null) {
                concepts.put(conceptIri, conceptLabel);
            } else {
                oldConceptLabel.withDefault(conceptLabel);
            }

            return this;
        }

    }

}
