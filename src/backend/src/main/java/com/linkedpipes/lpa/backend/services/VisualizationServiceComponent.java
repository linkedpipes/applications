package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.*;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.*;
import org.apache.jena.query.QueryExecutionFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VisualizationServiceComponent implements VisualizationService {

    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    @Override
    public List<Scheme> getSkosSchemes(@Nullable String graphIri) {
        ConstructSparqlQueryProvider provider = new SchemesQueryProvider();
        return new SchemesExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    @Override
    public List<HierarchyNode> getSkosScheme(@Nullable String graphIri, @NotNull String schemeUri) {
        ConstructSparqlQueryProvider provider = new SchemeQueryProvider(schemeUri);
        return new SchemeExtractor(schemeUri).extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    @Override
    public List<HierarchyNode> getSkosSchemeSubtree(@Nullable String graphIri, @NotNull String schemeUri, @Nullable String conceptUri) {
        if(conceptUri == null || conceptUri.isEmpty()) {
            ConstructSparqlQueryProvider provider = new HighLevelSchemeQueryProvider(schemeUri);
            return new HighLevelSchemeExtractor(schemeUri).extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
        }

        ConstructSparqlQueryProvider provider = new SchemeSubtreeQueryProvider(schemeUri, conceptUri);
        return new SchemeSubtreeExtractor(conceptUri).extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    @Override
    public List<Concept> getSkosConcepts(@Nullable String graphIri) {
        ConstructSparqlQueryProvider provider = new ConceptsQueryProvider();
        return new ConceptsExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    @Override
    public List<ConceptCount> getSkosConceptsCounts(@Nullable String graphIri, ConceptCountRequest request) {
        SelectSparqlQueryProvider provider = new ConceptsCountsQueryProvider(request.propertyUri, request.conceptUris);
        return new ConceptCountExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }
}
