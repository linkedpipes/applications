package com.linkedpipes.lpa.backend.sparql.queries;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPD;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPDConf;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.jetbrains.annotations.NotNull;

public class DefaultDataSourceConfigurationQueryProvider extends ConstructSparqlQueryProvider {

    public static final String VAR_CONFIG = var("config");
    public static final String VAR_QUERY = var("query");
    public static final String VAR_TITLE = var("title");

    @NotNull
    @Override
    protected ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix("lpd", LPD.uri)
                .addPrefix("lpd-conf", LPDConf.uri);
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_CONFIG, RDF.type, LPDConf.Configuration)
                .addConstruct(VAR_CONFIG, LPD.query, VAR_QUERY)
                .addConstruct(VAR_CONFIG, DCTerms.title, VAR_TITLE);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder
                .addWhere(VAR_CONFIG, RDF.type, LPDConf.Configuration);
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(VAR_CONFIG, LPD.query, VAR_QUERY)
                .addOptional(VAR_CONFIG, DCTerms.title, VAR_TITLE);
    }

}
