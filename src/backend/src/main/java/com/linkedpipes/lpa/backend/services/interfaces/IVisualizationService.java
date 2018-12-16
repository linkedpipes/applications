package com.linkedpipes.lpa.backend.services.interfaces;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCountRequest;
import com.linkedpipes.lpa.backend.entities.visualization.Scheme;

import java.util.List;

public interface IVisualizationService {
    List<Scheme> getSkosSchemes();

    List<Concept> getSkosConcepts();

    List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request);
}
