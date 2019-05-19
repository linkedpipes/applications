package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

/**
 * This class uses two template methods, get() and getForNamed(String).
 * Its mandatory sub-procedures are addVars(SelectBuilder) and addWheres(AbstractQueryBuilder).
 * Its non-mandatory hooks are addPrefixes(AbstractQueryBuilder), addOptionals(AbstractQueryBuilder),
 * addFilters(SelectBuilder), and addAdditional(AbstractQueryBuilder).
 */
public abstract class SelectSparqlQueryProvider extends SparqlQueryProvider<SelectBuilder> {

    @NotNull
    @Override
    public final Query get(@Nullable String graphName) {
        SelectBuilder builder = new SelectBuilder();

        try {
            addPrefixes(builder);
            addVars(builder);

            if(graphName != null && !graphName.isEmpty())
                builder.from(graphName);

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
    protected abstract SelectBuilder addVars(@NotNull SelectBuilder builder) throws ParseException;

    @NotNull
    protected SelectBuilder addFilters(@NotNull SelectBuilder builder) throws ParseException {
        return builder;
    }

}
