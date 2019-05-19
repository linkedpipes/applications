package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

/**
 * This class uses two template methods, get() and getForNamed(String).
 * Its mandatory sub-procedures are addConstructs(ConstructBuilder) and
 * addWheres(AbstractQueryBuilder). Its non-mandatory hooks are
 * addPrefixes(AbstractQueryBuilder), addOptionals(AbstractQueryBuilder), and
 * addAdditional(AbstractQueryBuilder).
 */
public abstract class ConstructSparqlQueryProvider extends SparqlQueryProvider<ConstructBuilder> {

    @NotNull
    @Override
    public final Query get(@Nullable String graphName) {
        ConstructBuilder builder = new ConstructBuilder();

        try {
            addPrefixes(builder);
            addConstructs(builder);

            if(graphName != null && !graphName.isEmpty())
                builder.from(graphName);

            addWheres(builder);
            addFilters(builder);
            addOptionals(builder);
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
