package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.*;

import java.util.List;

public interface VisualizationService {
    List<Scheme> getSkosSchemes(String graphIri);

    List<HierarchyNode> getSkosScheme(String graphIri, String schemeUri);

    List<HierarchyNode> getSkosSchemeSubtree(String graphIri, String schemeUri, String conceptUri);

    List<Concept> getSkosConcepts(String graphIri);

    List<ConceptCount> getSkosConceptsCounts(String graphIri, ConceptCountRequest request);
}
