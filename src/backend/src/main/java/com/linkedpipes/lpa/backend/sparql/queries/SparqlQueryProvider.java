package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.query.Query;

import java.util.function.Supplier;

import static java.util.Objects.requireNonNull;

public abstract class SparqlQueryProvider implements Supplier<Query> {

    protected static final String VAR_GRAPH = var("graph");

    protected static String var(String variableName) {
        if (requireNonNull(variableName).isEmpty()) {
            throw new IllegalArgumentException("variableName");
        }
        return variableName.startsWith("?") ? variableName : "?" + variableName;
    }

    @Override
    public abstract Query get();

    public abstract Query getForNamed(String name);

}
