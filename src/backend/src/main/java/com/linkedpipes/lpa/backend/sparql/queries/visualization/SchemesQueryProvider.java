package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

public class SchemesQueryProvider extends ConstructSparqlQueryProvider {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String RDF_PREFIX = "rdf";

    // VARIABLES
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_CONCEPT = var("c");

    @Override
    protected ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder
                .addPrefix(SKOS_PREFIX, SKOS.uri)
                .addPrefix(RDFS_PREFIX, RDFS.uri)
                .addPrefix(DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(RDF_PREFIX, RDF.uri);
    }

    @Override
    protected ConstructBuilder addConstructs(ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_SCHEME, RDF.type, SKOS.ConceptScheme)
                .addConstruct(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE)
                .addConstruct(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL);
    }

    @Override
    protected ConstructBuilder addWheres(ConstructBuilder builder) {
        return builder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addWhere(VAR_SCHEME, RDF.type, SKOS.ConceptScheme);
    }

    @Override
    protected ConstructBuilder addOptionals(ConstructBuilder builder) {
        return builder
                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE);
    }

}
