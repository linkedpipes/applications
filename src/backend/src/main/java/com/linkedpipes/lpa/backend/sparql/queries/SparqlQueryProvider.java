package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.query.Query;
import org.jetbrains.annotations.NotNull;

import java.util.function.Supplier;

public abstract class SparqlQueryProvider<B extends AbstractQueryBuilder<B>> implements Supplier<Query> {

    @NotNull
    protected static final String VAR_GRAPH = var("graph");

    @NotNull
    protected static String var(@NotNull String variableName) {
        if (variableName.isEmpty()) {
            throw new IllegalArgumentException("variableName");
        }
        return variableName.startsWith("?") ? variableName : "?" + variableName;
    }

    @Override
    @NotNull
    public abstract Query get();

    @NotNull
    public abstract Query getForNamed(@NotNull String name);

    @NotNull
    protected B addPrefixes(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected abstract B addWheres(@NotNull B builder);

    @NotNull
    protected B addOptionals(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected B addAdditional(@NotNull B builder) {
        return builder;
    }
}
