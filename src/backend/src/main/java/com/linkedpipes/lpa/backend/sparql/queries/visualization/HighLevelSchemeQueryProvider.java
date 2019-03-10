package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.arq.querybuilder.WhereBuilder;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class HighLevelSchemeQueryProvider extends ConstructSparqlQueryProvider {

    private String schemeUri;

    // VARIABLES
    private static final String VAR_SCHEME_PREF_LABEL = var("s_spl");
    private static final String VAR_SCHEME_RDFS_LABEL = var("s_lab");
    private static final String VAR_SCHEME_DCTERMS_TITLE = var("s_dctt");
    private static final String VAR_CONCEPT = var("c");
    private static final String VAR_CONCEPT_PREF_LABEL = var("c_spl");
    private static final String VAR_CONCEPT_RDFS_LABEL = var("c_lab");
    private static final String VAR_CONCEPT_DCTERMS_TITLE = var("c_dctt");

    public HighLevelSchemeQueryProvider(String schemeUri) {
        this.schemeUri = SparqlUtils.formatUri(schemeUri);
    }

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
                .addConstruct(schemeUri, RDF.type, SKOS.ConceptScheme)
                .addConstruct(schemeUri, SKOS.prefLabel, VAR_SCHEME_PREF_LABEL)
                .addConstruct(schemeUri, RDFS.label, VAR_SCHEME_RDFS_LABEL)
                .addConstruct(schemeUri, DCTerms.title, VAR_SCHEME_DCTERMS_TITLE)
                .addConstruct(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CONCEPT, SKOS.topConceptOf, schemeUri)
                .addConstruct(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, RDFS.label, VAR_CONCEPT_RDFS_LABEL)
                .addConstruct(VAR_CONCEPT, DCTerms.title, VAR_CONCEPT_DCTERMS_TITLE);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder
                .addWhere(schemeUri, RDF.type, SKOS.ConceptScheme)
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, schemeUri)
                .addWhere(VAR_CONCEPT, SKOS.topConceptOf, schemeUri);
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(schemeUri, SKOS.prefLabel, VAR_SCHEME_PREF_LABEL)
                .addOptional(schemeUri, RDFS.label, VAR_SCHEME_RDFS_LABEL)
                .addOptional(schemeUri, DCTerms.title, VAR_SCHEME_DCTERMS_TITLE)
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addOptional(VAR_CONCEPT, RDFS.label, VAR_CONCEPT_RDFS_LABEL)
                .addOptional(VAR_CONCEPT, DCTerms.title, VAR_CONCEPT_DCTERMS_TITLE);
    }

}
