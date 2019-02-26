package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.jetbrains.annotations.NotNull;

/**
 * This class uses two template methods, {@link #get()} and {@link #getForNamed(String)}.
 * Its mandatory sub-procedures are {@link #addVars(SelectBuilder)} and {@link #addWheres(AbstractQueryBuilder)}.
 * Its non-mandatory hooks are {@link #addPrefixes(AbstractQueryBuilder)}, {@link #addOptionals(AbstractQueryBuilder)},
 * {@link #addFilters(SelectBuilder)}, and {@link #addAdditional(AbstractQueryBuilder)}.
 */
public abstract class SelectSparqlQueryProvider extends SparqlQueryProvider<SelectBuilder> {

    @NotNull
    @Override
    public final Query get() {
        SelectBuilder builder = new SelectBuilder();

        try {
            addPrefixes(builder);
            addVars(builder);
            addWheres(builder);
            addOptionals(builder);
            addFilters(builder);
            addAdditional(builder);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        return builder.build();
    }

    @NotNull
    @Override
    public final Query getForNamed(@NotNull String name) {
        SelectBuilder builder = new SelectBuilder();

        try {
            addPrefixes(builder);
            addVars(builder);
            builder.fromNamed(name);

            SelectBuilder subQuery = addOptionals(addWheres(new SelectBuilder()));
            addFilters(subQuery);
            builder.addGraph(VAR_GRAPH, subQuery);
            addAdditional(builder);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        return builder.build();
    }

    @NotNull
    protected abstract SelectBuilder addVars(@NotNull SelectBuilder builder) throws ParseException;

    @NotNull
    protected SelectBuilder addFilters(@NotNull SelectBuilder builder) throws ParseException {
        return builder;
    }

}
