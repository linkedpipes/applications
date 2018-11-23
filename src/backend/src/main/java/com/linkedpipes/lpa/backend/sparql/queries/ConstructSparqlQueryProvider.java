package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;

/**
 * This class uses two template methods, {@link #get()} and {@link #getForNamed(String)}.
 * Its mandatory sub-procedures are {@link #addConstructs(ConstructBuilder)} and {@link #addWheres(ConstructBuilder)}.
 * Its non-mandatory hooks are {@link #addPrefixes(ConstructBuilder)} and {@link #addOptionals(ConstructBuilder)}.
 */
public abstract class ConstructSparqlQueryProvider extends SparqlQueryProvider {

    @Override
    public final Query get() {
        ConstructBuilder builder = new ConstructBuilder();

        addPrefixes(builder);
        addConstructs(builder);
        addWheres(builder);
        addOptionals(builder);

        return builder.build();
    }

    @Override
    public final Query getForNamed(String name) {
        ConstructBuilder builder = new ConstructBuilder();

        addPrefixes(builder);
        addConstructs(builder);
        builder.fromNamed(name);
        builder.addGraph(VAR_GRAPH, addOptionals(addWheres(new ConstructBuilder())));

        return builder.build();
    }

    protected ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder;
    }

    protected abstract ConstructBuilder addConstructs(ConstructBuilder builder);

    protected abstract ConstructBuilder addWheres(ConstructBuilder builder);

    protected ConstructBuilder addOptionals(ConstructBuilder builder) {
        return builder;
    }

}
