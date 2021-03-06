package com.linkedpipes.lpa.backend.sparql.queries;

import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.jetbrains.annotations.NotNull;

public class ExtractGraphQueryProvider extends ConstructSparqlQueryProvider {

    // VARIABLES
    private static final String VAR_S = var("s");
    private static final String VAR_P = var("p");
    private static final String VAR_O = var("o");

    @NotNull
    @Override
    protected ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder;
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder.addConstruct(VAR_S, VAR_P, VAR_O);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder.addWhere(VAR_S, VAR_P, VAR_O);
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder;
    }

}
