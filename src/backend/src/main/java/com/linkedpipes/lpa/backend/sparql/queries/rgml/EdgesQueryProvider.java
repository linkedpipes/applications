package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;
import org.jetbrains.annotations.NotNull;

public class EdgesQueryProvider extends ConstructSparqlQueryProvider {

    // VARIABLES
    public static final String VAR_EDGE = var("edge");
    public static final String VAR_SOURCE = var("source");
    public static final String VAR_TARGET = var("target");
    public static final String VAR_WEIGHT = var("weight");

    @NotNull
    @Override
    public ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.RGML_PREFIX, RGML.uri)
                .addPrefix(Prefixes.RDF_PREFIX, RDF.getURI());
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_EDGE, RDF.type, SparqlUtils.formatUri(RGML.Edge.getURI()))
                .addConstruct(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addConstruct(VAR_EDGE, RGML.target, VAR_TARGET)
                .addConstruct(VAR_EDGE, RGML.weight, VAR_WEIGHT);
    }

    @NotNull
    @Override
    public ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder
                .addWhere(VAR_EDGE, RDF.type, SparqlUtils.formatUri(RGML.Edge.getURI()))
                .addWhere(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addWhere(VAR_EDGE, RGML.target, VAR_TARGET)
                .addWhere(VAR_EDGE, RGML.weight, VAR_WEIGHT);
    }
}
