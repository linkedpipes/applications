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

    // Variables
    private static final String VAR_SUBJECT = var("subject");
    public static final String VAR_P = var("p");
    public static final String VAR_CONCEPT = var("concept");
    public static final String VAR_SCHEME = var("scheme");

    // Label variables in order of decreasing usefulness to end user
    private static final String VAR_CONCEPT_SKOS_PREF_LABEL = var("c_spl");
    private static final String VAR_CONCEPT_RDFS_LABEL = var("c_rdfsl");
    private static final String VAR_CONCEPT_DCTERMS_TITLE = var("c_dctt");
    private static final String VAR_CONCEPT_SCHEMA_TITLE = var("c_st");
    private static final String VAR_CONCEPT_SCHEMA_DESCRIPTION = var("c_sd");

    private static final String VAR_SCHEME_SKOS_PREF_LABEL = var("s_spl");
    private static final String VAR_SCHEME_RDFS_LABEL = var("s_rdfsl");
    private static final String VAR_SCHEME_DCTERMS_TITLE = var("s_dctt");
    private static final String VAR_SCHEME_SCHEMA_TITLE = var("s_st");
    private static final String VAR_SCHEME_SCHEMA_DESCRIPTION = var("s_sd");

    public static final String[] CONCEPT_LABEL_VARIABLES = {VAR_CONCEPT_SKOS_PREF_LABEL, VAR_CONCEPT_RDFS_LABEL,
            VAR_CONCEPT_DCTERMS_TITLE, VAR_CONCEPT_SCHEMA_TITLE, VAR_CONCEPT_SCHEMA_DESCRIPTION};
    public static final String[] SCHEME_LABEL_VARIABLES = {VAR_SCHEME_SKOS_PREF_LABEL, VAR_SCHEME_RDFS_LABEL,
            VAR_SCHEME_DCTERMS_TITLE, VAR_SCHEME_SCHEMA_TITLE, VAR_SCHEME_SCHEMA_DESCRIPTION};

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

                .addVar(VAR_CONCEPT)
                .addVar(VAR_CONCEPT_SKOS_PREF_LABEL)
                .addVar(VAR_CONCEPT_RDFS_LABEL)
                .addVar(VAR_CONCEPT_DCTERMS_TITLE)
                .addVar(VAR_CONCEPT_SCHEMA_TITLE)
                .addVar(VAR_CONCEPT_SCHEMA_DESCRIPTION)

                .addVar(VAR_SCHEME)
                .addVar(VAR_SCHEME_SKOS_PREF_LABEL)
                .addVar(VAR_SCHEME_RDFS_LABEL)
                .addVar(VAR_SCHEME_DCTERMS_TITLE)
                .addVar(VAR_SCHEME_SCHEMA_TITLE)
                .addVar(VAR_SCHEME_SCHEMA_DESCRIPTION);
    }

    @NotNull
    @Override
    public SelectBuilder addWheres(@NotNull SelectBuilder builder) {
        return builder
                .addWhere(VAR_SUBJECT, Schema.geo, NodeFactory.createBlankNode())
                .addWhere(VAR_SUBJECT, VAR_P, VAR_CONCEPT)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME);
    }

    @NotNull
    @Override
    public SelectBuilder addOptionals(@NotNull SelectBuilder builder) {
        return builder
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_SKOS_PREF_LABEL)
                .addOptional(VAR_CONCEPT, RDFS.label, VAR_CONCEPT_RDFS_LABEL)
                .addOptional(VAR_CONCEPT, DCTerms.title, VAR_CONCEPT_DCTERMS_TITLE)
                .addOptional(VAR_CONCEPT, Schema.title, VAR_CONCEPT_SCHEMA_TITLE)
                .addOptional(VAR_CONCEPT, Schema.description, VAR_CONCEPT_SCHEMA_DESCRIPTION)

                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_SCHEME_SKOS_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_SCHEME_RDFS_LABEL)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_SCHEME_DCTERMS_TITLE)
                .addOptional(VAR_SCHEME, Schema.title, VAR_SCHEME_SCHEMA_TITLE)
                .addOptional(VAR_SCHEME, Schema.description, VAR_SCHEME_SCHEMA_DESCRIPTION);
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

}
