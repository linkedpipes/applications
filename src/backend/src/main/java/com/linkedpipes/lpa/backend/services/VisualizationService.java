package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCountRequest;
import com.linkedpipes.lpa.backend.entities.visualization.Scheme;

import java.util.List;

public interface VisualizationService {
    List<Scheme> getSkosSchemes();

    List<Scheme> getSkosSchemesFromNamed(String graphIri);

    List<Concept> getSkosConcepts();

    List<Concept> getSkosConceptsFromNamed(String graphIri);

    List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request);

    List<ConceptCount> getSkosConceptsCountsFromNamed(String graphIri, ConceptCountRequest request);
}
