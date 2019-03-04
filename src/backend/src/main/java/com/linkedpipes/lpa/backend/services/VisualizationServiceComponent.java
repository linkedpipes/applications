package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.ConceptCountExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.ConceptsExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.SchemeExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.SchemesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsCountsQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.SchemeQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.SchemesQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisualizationServiceComponent implements VisualizationService {

    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    @Override
    public List<Scheme> getSkosSchemes() {
        ConstructSparqlQueryProvider provider = new SchemesQueryProvider();
        return new SchemesExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    @Override
    public List<Scheme> getSkosSchemesFromNamed(String graphIri) {
        ConstructSparqlQueryProvider provider = new SchemesQueryProvider();
        return new SchemesExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.getForNamed(graphIri)));
    }

    @Override
    public List<HierarchyNode> getSkosScheme(String schemeUri) {
        ConstructSparqlQueryProvider provider = new SchemeQueryProvider(schemeUri);
        return new SchemeExtractor(schemeUri).extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    @Override
    public List<HierarchyNode> getSkosSchemeFromNamed(String graphIri, String schemeUri) {
        ConstructSparqlQueryProvider provider = new SchemeQueryProvider(schemeUri);
        return new SchemeExtractor(schemeUri).extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.getForNamed(graphIri)));
    }

    @Override
    public List<Concept> getSkosConcepts() {
        ConstructSparqlQueryProvider provider = new ConceptsQueryProvider();
        return new ConceptsExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    @Override
    public List<Concept> getSkosConceptsFromNamed(String graphIri) {
        ConstructSparqlQueryProvider provider = new ConceptsQueryProvider();
        return new ConceptsExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.getForNamed(graphIri)));
    }

    @Override
    public List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request) {
        SelectSparqlQueryProvider provider = new ConceptsCountsQueryProvider(request.propertyUri, request.conceptUris);
        return new ConceptCountExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    @Override
    public List<ConceptCount> getSkosConceptsCountsFromNamed(String graphIri, ConceptCountRequest request) {
        SelectSparqlQueryProvider provider = new ConceptsCountsQueryProvider(request.propertyUri, request.conceptUris);
        return new ConceptCountExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.getForNamed(graphIri)));
    }

}
