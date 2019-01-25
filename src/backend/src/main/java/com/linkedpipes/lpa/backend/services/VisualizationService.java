package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.*;

import java.util.List;

public interface VisualizationService {
    List<Scheme> getSkosSchemes();

    List<Scheme> getSkosSchemesFromNamed(String graphIri);

    HierarchyNode getSkosScheme(String graphIri, String schemeUri);

    List<Concept> getSkosConcepts();

    List<Concept> getSkosConceptsFromNamed(String graphIri);

    List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request);

    List<ConceptCount> getSkosConceptsCountsFromNamed(String graphIri, ConceptCountRequest request);
}
