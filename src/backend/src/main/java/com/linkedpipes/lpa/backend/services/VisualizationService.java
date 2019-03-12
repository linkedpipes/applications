package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.*;

import java.util.List;

public interface VisualizationService {
    List<Scheme> getSkosSchemes();

    List<Scheme> getSkosSchemesFromNamed(String graphIri);

    List<HierarchyNode> getSkosScheme(String schemeUri);

    List<HierarchyNode> getSkosSchemeFromNamed(String graphIri, String schemeUri);

    List<HierarchyNode> getSkosSchemeSubtree(String schemeUri, String conceptUri);

    List<HierarchyNode> getSkosSchemeSubtreeFromNamed(String graphIri, String schemeUri, String conceptUri);

    List<Concept> getSkosConcepts();

    List<Concept> getSkosConceptsFromNamed(String graphIri);

    List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request);

    List<ConceptCount> getSkosConceptsCountsFromNamed(String graphIri, ConceptCountRequest request);
}
