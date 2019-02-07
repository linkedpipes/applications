package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.AbstractQueryBuilder;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;
import org.jetbrains.annotations.NotNull;

/**
 * This class uses two template methods, {@link #get()} and {@link #getForNamed(String)}.
 * Its mandatory sub-procedures are {@link #addConstructs(ConstructBuilder)} and {@link
 * #addWheres(AbstractQueryBuilder)}. Its non-mandatory hooks are {@link #addPrefixes(AbstractQueryBuilder)}, {@link
 * #addOptionals(AbstractQueryBuilder)}, and {@link #addAdditional(AbstractQueryBuilder)}.
 */
public abstract class ConstructSparqlQueryProvider extends SparqlQueryProvider<ConstructBuilder> {

    @NotNull
    @Override
    public final Query get() {
        ConstructBuilder builder = new ConstructBuilder();

        addPrefixes(builder);
        addConstructs(builder);
        addWheres(builder);
        addOptionals(builder);

        return builder.build();
    }

    @NotNull
    @Override
    public final Query getForNamed(@NotNull String name) {
        ConstructBuilder builder = new ConstructBuilder();

        addPrefixes(builder);
        addConstructs(builder);
        builder.fromNamed(name);

        builder.addGraph(VAR_GRAPH, addOptionals(addWheres(new ConstructBuilder())));
        addWheres(builder);
        addOptionals(builder);

        return builder.build();
    }

    @NotNull
    protected abstract ConstructBuilder addConstructs(@NotNull ConstructBuilder builder);

}
