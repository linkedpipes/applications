package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.vocabulary.SCHEMA;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

public class GeoPropertiesQueryProvider extends SelectSparqlQueryProvider {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SCHEMA_PREFIX = "s";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String RDF_PREFIX = "rdf";

    // VARIABLES
    public static final String VAR_SUBJECT = var("subject");
    public static final String VAR_SCHEME = var("scheme");
    public static final String VAR_GEO = var("g");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_NOTATION = var("sn");
    public static final String VAR_NAME = var("st");
    public static final String VAR_DESCRIPTION = var("sd");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_P = var("p");
    public static final String VAR_O = var("o");

    public static final String[] LABEL_VARIABLES = {VAR_RDFS_LABEL, VAR_PREF_LABEL, VAR_NAME, VAR_NOTATION, VAR_DCTERMS_TITLE};

    @Override
    public SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder
                .addPrefix(SKOS_PREFIX, SKOS.getURI())
                .addPrefix(SCHEMA_PREFIX, SCHEMA.uri)
                .addPrefix(RDFS_PREFIX, RDFS.getURI())
                .addPrefix(DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(RDF_PREFIX, RDF.getURI());
    }

    @Override
    public SelectBuilder addVars(SelectBuilder builder) {
        return builder
                .setDistinct(true)
                .addVar(VAR_P)
                .addVar(VAR_PREF_LABEL)
                .addVar(VAR_RDFS_LABEL)
                .addVar(VAR_NOTATION)
                .addVar(VAR_SCHEME);
    }

    @Override
    public SelectBuilder addWheres(SelectBuilder builder) {
        return builder
                .addWhere(VAR_SUBJECT, SCHEMA.geo, NodeFactory.createBlankNode())
                .addWhere(VAR_SUBJECT, VAR_P, VAR_O)
                .addWhere(VAR_O, SKOS.inScheme, VAR_SCHEME);
    }

    @Override
    public SelectBuilder addOptionals(SelectBuilder builder) {
        return builder
                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, SKOS.notation, VAR_NOTATION)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE)
                .addOptional(VAR_SCHEME, SCHEMA.title, VAR_NAME)
                .addOptional(VAR_SCHEME, SCHEMA.description, VAR_DESCRIPTION);
    }

    @Override
    public SelectBuilder addFilters(SelectBuilder builder) throws ParseException {
        return builder
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(SKOS.prefLabel.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(SCHEMA.geo.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(RDF.type.toString()))
                .addFilter(VAR_P + "!=" + SparqlUtils.formatUri(RDFS.seeAlso.toString()));
    }

    @Override
    public SelectBuilder addAdditional(SelectBuilder builder) {
        return builder.setLimit(1000);
    }

}
