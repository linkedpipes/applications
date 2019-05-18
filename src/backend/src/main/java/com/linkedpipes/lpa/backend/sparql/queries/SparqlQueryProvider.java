package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.function.Supplier;

public abstract class SparqlQueryProvider<B extends AbstractQueryBuilder<B>> implements Supplier<Query> {

    @NotNull
    protected static String var(@NotNull String variableName) {
        if (variableName.isEmpty()) {
            throw new IllegalArgumentException("variableName");
        }
        return variableName.startsWith("?") ? variableName : "?" + variableName;
    }

    @Override
    @NotNull
    public Query get() { return get(null);}

    @NotNull
    public abstract Query get(@Nullable String graphName);

    @NotNull
    protected B addPrefixes(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected abstract B addWheres(@NotNull B builder) throws ParseException;

    @NotNull
    protected B addOptionals(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected B addGroupBy(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected B addLimit(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected B addOffset(@NotNull B builder) {
        return builder;
    }

    @NotNull
    protected B addAdditional(@NotNull B builder) {
        return builder;
    }

}
