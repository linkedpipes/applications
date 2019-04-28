package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

import java.util.List;

public interface VisualizationService {
    List<Scheme> getSkosSchemes(String graphIri) throws LpAppsException;

    List<HierarchyNode> getSkosScheme(String graphIri, String schemeUri) throws LpAppsException;

    List<HierarchyNode> getSkosSchemeSubtree(String graphIri, String schemeUri, String conceptUri) throws LpAppsException;

    List<Concept> getSkosConcepts(String graphIri) throws LpAppsException;

    List<ConceptCount> getSkosConceptsCounts(String graphIri, ConceptCountRequest request) throws LpAppsException;
}
