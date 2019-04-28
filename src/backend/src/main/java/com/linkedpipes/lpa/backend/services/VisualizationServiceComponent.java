package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.*;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.*;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisualizationServiceComponent implements VisualizationService {

    @Override
    public List<Scheme> getSkosSchemes(@Nullable String graphIri) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new SchemesQueryProvider();
        return JenaUtils.withQueryExecution(provider.get(graphIri), new SchemesExtractor()::extract);
    }

    @Override
    public List<HierarchyNode> getSkosScheme(@Nullable String graphIri, @NotNull String schemeUri) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new SchemeQueryProvider(schemeUri);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new SchemeExtractor(schemeUri)::extract);
    }

    @Override
    public List<HierarchyNode> getSkosSchemeSubtree(@Nullable String graphIri, @NotNull String schemeUri, @Nullable String conceptUri) throws LpAppsException {
        if(conceptUri == null || conceptUri.isEmpty()) {
            ConstructSparqlQueryProvider provider = new HighLevelSchemeQueryProvider(schemeUri);
            return JenaUtils.withQueryExecution(provider.get(graphIri), new HighLevelSchemeExtractor(schemeUri)::extract);
        }

        ConstructSparqlQueryProvider provider = new SchemeSubtreeQueryProvider(schemeUri, conceptUri);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new SchemeSubtreeExtractor(conceptUri)::extract);
    }

    @Override
    public List<Concept> getSkosConcepts(@Nullable String graphIri) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new ConceptsQueryProvider();
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ConceptsExtractor()::extract);
    }

    @Override
    public List<ConceptCount> getSkosConceptsCounts(@Nullable String graphIri, ConceptCountRequest request) throws LpAppsException {
        SelectSparqlQueryProvider provider = new ConceptsCountsQueryProvider(request.propertyUri, request.conceptUris);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ConceptCountExtractor()::extract);
    }
}
