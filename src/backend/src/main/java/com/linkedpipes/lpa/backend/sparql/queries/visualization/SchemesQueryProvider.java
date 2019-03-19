package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class SchemesQueryProvider extends ConstructSparqlQueryProvider {

    // VARIABLES
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_CONCEPT = var("c");

    @NotNull
    @Override
    protected ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.SKOS_PREFIX, SKOS.uri)
                .addPrefix(Prefixes.RDFS_PREFIX, RDFS.uri)
                .addPrefix(Prefixes.DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(Prefixes.RDF_PREFIX, RDF.uri);
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_SCHEME, RDF.type, SKOS.ConceptScheme)
                .addConstruct(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE)
                .addConstruct(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addWhere(VAR_SCHEME, RDF.type, SKOS.ConceptScheme);
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE);
    }

}
