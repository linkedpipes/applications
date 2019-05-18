package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
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
 *     <li>{@link #addConstructs(ConstructBuilder)}</li>
 *     <li>{@link #addWheres(AbstractQueryBuilder)}</li>
 * </ul>
 *
 * Non-mandatory hooks:
 * <ul>
 *     <li>{@link #addPrefixes(AbstractQueryBuilder)}</li>
 *     <li>{@link #addOptionals(AbstractQueryBuilder)}</li>
 *     <li>{@link #addFilters(ConstructBuilder)}</li>
 *     <li>{@link #addGroupBy(AbstractQueryBuilder)}</li>
 *     <li>{@link #addLimit(AbstractQueryBuilder)}</li>
 *     <li>{@link #addOffset(AbstractQueryBuilder)}</li>
 *     <li>{@link #addAdditional(AbstractQueryBuilder)}</li>
 * </ul>
 */
public abstract class ConstructSparqlQueryProvider extends SparqlQueryProvider<ConstructBuilder> {

    @NotNull
    @Override
    public final Query get(@Nullable String graphName) {
        ConstructBuilder builder = new ConstructBuilder();

        try {
            addPrefixes(builder);
            addConstructs(builder);

            if (graphName != null && !graphName.isEmpty())
                builder.from(graphName);

            addWheres(builder);
            addOptionals(builder);
            addFilters(builder);
            addGroupBy(builder);
            addLimit(builder);
            addOffset(builder);
            addAdditional(builder);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        return builder.build();
    }

    @NotNull
    protected abstract ConstructBuilder addConstructs(@NotNull ConstructBuilder builder);

    @NotNull
    protected ConstructBuilder addFilters(@NotNull ConstructBuilder builder) throws ParseException {
        return builder;
    }

}
