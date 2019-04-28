package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Schema;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class GeoPropertiesQueryProvider extends SelectSparqlQueryProvider {

    // VARIABLES
    public static final String VAR_SUBJECT = var("subject");
    public static final String VAR_SCHEME = var("scheme");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_NOTATION = var("sn");
    public static final String VAR_NAME = var("st");
    public static final String VAR_DESCRIPTION = var("sd");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_P = var("p");
    public static final String VAR_O = var("o");

    public static final String[] NODE_VARIABLES = {VAR_P, VAR_SCHEME};
    public static final String[] LABEL_VARIABLES = {VAR_RDFS_LABEL, VAR_PREF_LABEL, VAR_NAME, VAR_NOTATION, VAR_DCTERMS_TITLE};

    @NotNull
    @Override
    public SelectBuilder addPrefixes(@NotNull SelectBuilder builder) {
        return builder
                .addPrefix(Prefixes.SKOS_PREFIX, SKOS.getURI())
                .addPrefix(Prefixes.SCHEMA_PREFIX, Schema.uri)
                .addPrefix(Prefixes.RDFS_PREFIX, RDFS.getURI())
                .addPrefix(Prefixes.DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(Prefixes.RDF_PREFIX, RDF.getURI());
    }

    @NotNull
    @Override
    public SelectBuilder addVars(@NotNull SelectBuilder builder) {
        return builder
                .setDistinct(true)
                .addVar(VAR_P)
                .addVar(VAR_PREF_LABEL)
                .addVar(VAR_RDFS_LABEL)
                .addVar(VAR_NOTATION)
                .addVar(VAR_SCHEME);
    }

    @NotNull
    @Override
    public SelectBuilder addWheres(@NotNull SelectBuilder builder) {
        return builder
                .addWhere(VAR_SUBJECT, Schema.geo, NodeFactory.createBlankNode())
                .addWhere(VAR_SUBJECT, VAR_P, VAR_O)
                .addWhere(VAR_O, SKOS.inScheme, VAR_SCHEME);
    }

    @NotNull
    @Override
    public SelectBuilder addOptionals(@NotNull SelectBuilder builder) {
        //TODO what is the point of having these if we don't return them in projection (addVars method)?
        return builder
                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, SKOS.notation, VAR_NOTATION)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE)
                .addOptional(VAR_SCHEME, Schema.title, VAR_NAME)
                .addOptional(VAR_SCHEME, Schema.description, VAR_DESCRIPTION);
    }

    @NotNull
    @Override
    public SelectBuilder addFilters(@NotNull SelectBuilder builder) throws ParseException {
        return builder
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(SKOS.prefLabel.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(Schema.geo.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(RDF.type.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(RDFS.seeAlso.toString()));
    }

    @NotNull
    @Override
    public SelectBuilder addAdditional(@NotNull SelectBuilder builder) {
        return builder.setLimit(1000);
    }

}
