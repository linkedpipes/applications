package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.sparql.extractors.SimpleQueryExecutionResultExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsCountsQueryProvider;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Resource;

public class ConceptCountExtractor extends SimpleQueryExecutionResultExtractor<ConceptCount> {

    @Override
    protected String getPropertyVariableName() {
        return ConceptsCountsQueryProvider.VAR_COUNT;
    }

    @Override
    public ConceptCount withResourceSolution(Resource res, QuerySolution qs) {
        return null;
    }

    @Override
    public ConceptCount withLiteralSolution(Literal literal) {
        return null;
    }

}
