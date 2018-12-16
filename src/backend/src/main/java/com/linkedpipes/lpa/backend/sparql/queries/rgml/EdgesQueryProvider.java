package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;

public class EdgesQueryProvider extends ConstructSparqlQueryProvider {

    // PREFIXES
    private static final String RDF_PREFIX = "rdf";
    private static final String RGML_PREFIX = "rgml";

    // VARIABLES
    public static final String VAR_EDGE = var("edge");
    public static final String VAR_SOURCE = var("source");
    public static final String VAR_TARGET = var("target");
    public static final String VAR_WEIGHT = var("weight");

    @Override
    public ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder
                .addPrefix(RGML_PREFIX, RGML.uri)
                .addPrefix(RDF_PREFIX, RDF.getURI());
    }

    @Override
    protected ConstructBuilder addConstructs(ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_EDGE, RDF.type, RGML.Edge)
                .addConstruct(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addConstruct(VAR_EDGE, RGML.target, VAR_TARGET)
                .addConstruct(VAR_EDGE, RGML.weight, VAR_WEIGHT);
    }

    @Override
    public ConstructBuilder addWheres(ConstructBuilder builder) {
        return builder
                .addWhere(VAR_EDGE, RDF.type, RGML.Edge)
                .addWhere(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addWhere(VAR_EDGE, RGML.target, VAR_TARGET)
                .addWhere(VAR_EDGE, RGML.weight, VAR_WEIGHT);
    }
}
