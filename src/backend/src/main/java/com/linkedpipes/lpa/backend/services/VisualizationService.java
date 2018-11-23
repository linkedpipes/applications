package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCountRequest;
import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.ConceptCountExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.ConceptsExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.visualization.SchemesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsCountsQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.SchemesQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;

import java.util.List;

public class VisualizationService {

    private static final String ENDPOINT = Application.getConfig().getProperty("sparqlEndpoint");

    public List<Scheme> getSkosSchemes() {
        ConstructSparqlQueryProvider provider = new SchemesQueryProvider();
        return new SchemesExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    public List<Concept> getSkosConcepts() {
        ConstructSparqlQueryProvider provider = new ConceptsQueryProvider();
        return new ConceptsExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    public List<ConceptCount> getSkosConceptsCounts(ConceptCountRequest request) {
        SelectSparqlQueryProvider provider = new ConceptsCountsQueryProvider(request.propertyUri, request.conceptUris);
        return new ConceptCountExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

}
