package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

/**
 * Template method design pattern.<br>
 * <br>
 * Template methods:
 * <ul>
 *     <li>{@link #get()}</li>
 *     <li>{@link #get(String)}</li>
 * </ul>
 *
 * Mandatory sub-procedures:
 * <ul>
 *     <li>{@link #addVars(SelectBuilder)}</li>
 *     <li>{@link #addWheres(AbstractQueryBuilder)}</li>
 * </ul>
 *
 * Non-mandatory hooks:
 * <ul>
 *     <li>{@link #addPrefixes(AbstractQueryBuilder)}</li>
 *     <li>{@link #addOptionals(AbstractQueryBuilder)}</li>
 *     <li>{@link #addFilters(SelectBuilder)}</li>
 *     <li>{@link #addAdditional(AbstractQueryBuilder)}</li>
 * </ul>
 */
public abstract class SelectSparqlQueryProvider extends SparqlQueryProvider<SelectBuilder> {

    @NotNull
    @Override
    public final Query get(@Nullable String graphName) {
        SelectBuilder builder = new SelectBuilder();

        try {
            addPrefixes(builder);
            addVars(builder);

            if (graphName != null && !graphName.isEmpty())
                builder.from(graphName);

            addWheres(builder);
            addOptionals(builder);
            addFilters(builder);
            addGroupBy(builder);
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
