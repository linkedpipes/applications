package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class uses two template methods, {@link #get()} and {@link #getForNamed(String)}.
 * Its mandatory sub-procedures are {@link #addVars(SelectBuilder)} and {@link #addWheres(SelectBuilder)}.
 * Its non-mandatory hooks are {@link #addPrefixes(SelectBuilder)}, {@link #addOptionals(SelectBuilder)}, {@link
 * #addFilters(SelectBuilder)}, and {@link #addAdditional(SelectBuilder)}.
 */
public abstract class SelectSparqlQueryProvider extends SparqlQueryProvider {

    private static final Logger logger = LoggerFactory.getLogger(SelectSparqlQueryProvider.class);

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
        }
        catch (ParseException e) {
            logger.error("Exception while parsing query", e);
            throw new RuntimeException(e);
        }

        return builder.build();
    }

    @Override
    public final Query getForNamed(String name) {
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
            logger.error("Exception while parsing query", e);
            throw new RuntimeException(e);
        }

        return builder.build();
    }

    protected SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder;
    }

    protected abstract SelectBuilder addVars(SelectBuilder builder) throws ParseException;

    protected abstract SelectBuilder addWheres(SelectBuilder builder);

    protected SelectBuilder addOptionals(SelectBuilder builder) {
        return builder;
    }

    protected SelectBuilder addFilters(SelectBuilder builder) throws ParseException {
        return builder;
    }

    protected SelectBuilder addAdditional(SelectBuilder builder) {
        return builder;
    }

}
