package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.sparql.queries.visualization.ConceptsCountsQueryProvider;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;

import java.util.List;
import java.util.Spliterator;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.util.Spliterator.*;
import static java.util.Spliterators.spliteratorUnknownSize;

public class ConceptCountExtractor {

    protected String getPropertyVariableName() {
        return ConceptsCountsQueryProvider.VAR_COUNT;
    }

    public ConceptCount withResourceSolution(Resource res, QuerySolution qs) {
        return null;
    }

    public ConceptCount withLiteralSolution(Literal literal) {
        return null;
    }

    public List<ConceptCount> extract(QueryExecution queryExecution) {
        ResultSet result = queryExecution.execSelect();

        Spliterator<QuerySolution> spliterator =
                spliteratorUnknownSize(result, ORDERED | DISTINCT | NONNULL | IMMUTABLE);

        return StreamSupport.stream(spliterator, false)
                .map(this::extractObject)
                .collect(Collectors.toList());
    }

    private ConceptCount extractObject(QuerySolution qs) {
        String propertyVarName = getPropertyVariableName();

        if (qs.contains(propertyVarName)) {
            RDFNode node = qs.get(propertyVarName);
            if (node.isResource()) {
                return withResourceSolution(node.asResource(), qs);
            } else if (node.isLiteral()) {
                return withLiteralSolution(node.asLiteral());
            }
        }

        return null;
    }
}
