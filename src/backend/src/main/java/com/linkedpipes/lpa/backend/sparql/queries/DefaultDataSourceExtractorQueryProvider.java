package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.jetbrains.annotations.NotNull;

public class DefaultDataSourceExtractorQueryProvider extends ConstructSparqlQueryProvider {

    public static final String VAR_S = var("s");
    public static final String VAR_P = var("p");
    public static final String VAR_O = var("o");

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

}
