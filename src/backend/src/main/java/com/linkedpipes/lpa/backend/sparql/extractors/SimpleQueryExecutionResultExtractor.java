package com.linkedpipes.lpa.backend.sparql.extractors;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;

import java.util.Arrays;
import java.util.List;
import java.util.Spliterator;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.util.Spliterator.*;
import static java.util.Spliterators.spliteratorUnknownSize;

public abstract class SimpleQueryExecutionResultExtractor<T> {

    protected abstract String getPropertyVariableName();
    public abstract T withResourceSolution(Resource res, QuerySolution qs);
    public abstract T withLiteralSolution(Literal literal);

    public List<T> extract(QueryExecution queryExecution){
        ResultSet result = queryExecution.execSelect();

        Spliterator<QuerySolution> spliterator =
                spliteratorUnknownSize(result, ORDERED | DISTINCT | NONNULL | IMMUTABLE);

        return StreamSupport.stream(spliterator, false)
                .map(this::extractObject)
                .collect(Collectors.toList());
    }

    private T extractObject(QuerySolution qs){
        String propertyVarName = getPropertyVariableName();

        if(qs.contains(propertyVarName)){
            RDFNode node = qs.get(propertyVarName);
            if(node.isResource()){
                return withResourceSolution(node.asResource(), qs);
            }
            else if(node.isLiteral()){
                return withLiteralSolution(node.asLiteral());
            }
        }

        return null;
    }

    protected LocalizedValue getLabel(QuerySolution solution, String[] labelVariables){
        return Arrays.stream(labelVariables)
                .filter(solution::contains)
                .map(l -> localizedLabel(solution.get(l).asLiteral()))
                .findAny().orElse(null);
    }

    protected LocalizedValue localizedLabel(Literal literal){
        return new LocalizedValue(literal.getLanguage(), literal.getString());
    }
}
