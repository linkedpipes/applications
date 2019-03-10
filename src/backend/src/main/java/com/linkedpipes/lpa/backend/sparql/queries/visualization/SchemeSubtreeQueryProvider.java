package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.arq.querybuilder.WhereBuilder;
import org.apache.jena.sparql.path.P_Alt;
import org.apache.jena.sparql.path.P_Link;
import org.apache.jena.sparql.path.Path;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class SchemeSubtreeQueryProvider extends ConstructSparqlQueryProvider {

    private String schemeUri;
    private String conceptUri;

    // VARIABLES
    private static final String VAR_CONCEPT_PREF_LABEL = var("s_spl");
    private static final String VAR_CONCEPT_RDFS_LABEL = var("s_lab");
    private static final String VAR_CONCEPT_DCTERMS_TITLE = var("s_dctt");
    private static final String VAR_CHILD_CONCEPT = var("c");
    private static final String VAR_CHILD_CONCEPT_PREF_LABEL = var("c_spl");
    private static final String VAR_CHILD_CONCEPT_RDFS_LABEL = var("c_lab");
    private static final String VAR_CHILD_CONCEPT_DCTERMS_TITLE = var("c_dctt");
    //private static final String VAR_CHILD_CONCEPT_SIZE_VALUE = var("c_val");

    public SchemeSubtreeQueryProvider(String schemeUri, String conceptUri) {
        this.schemeUri = SparqlUtils.formatUri(schemeUri);
        this.conceptUri = SparqlUtils.formatUri(conceptUri);
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
                .addConstruct(conceptUri, RDF.type, SKOS.Concept)
                .addConstruct(conceptUri, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addConstruct(conceptUri, RDFS.label, VAR_CONCEPT_RDFS_LABEL)
                .addConstruct(conceptUri, DCTerms.title, VAR_CONCEPT_DCTERMS_TITLE)
                .addConstruct(VAR_CHILD_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CHILD_CONCEPT, SKOS.prefLabel, VAR_CHILD_CONCEPT_PREF_LABEL)
                .addConstruct(VAR_CHILD_CONCEPT, RDFS.label, VAR_CHILD_CONCEPT_RDFS_LABEL)
                .addConstruct(VAR_CHILD_CONCEPT, DCTerms.title, VAR_CHILD_CONCEPT_DCTERMS_TITLE)
                .addConstruct(VAR_CHILD_CONCEPT, SKOS.broader, conceptUri);
                //.addConstruct(VAR_CONCEPT, RDF.value, VAR_CONCEPT_SIZE_VALUE)
                //.addConstruct(VAR_CONCEPT, SKOS.broader, VAR_CONCEPT_BROADER)
                //.addConstruct(VAR_CONCEPT, SKOS.broaderTransitive, VAR_CONCEPT_BROADER_TRANSITIVE);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
         return builder
            .addWhere(conceptUri, RDF.type, SKOS.Concept)
            .addWhere(conceptUri, SKOS.inScheme, schemeUri)
            .addWhere(VAR_CHILD_CONCEPT, RDF.type, SKOS.Concept)
            .addWhere(VAR_CHILD_CONCEPT, SKOS.inScheme, schemeUri)
            .addWhere(VAR_CHILD_CONCEPT, new P_Alt(new P_Link(SKOS.broader.asNode()), new P_Link(SKOS.broaderTransitive.asNode())), conceptUri);
         //TODO possibly change above last condition such that child_concept has conceptUri as skos:broader, and if not then it MUST have conceptUri as skos:broaderTransitive
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(conceptUri, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addOptional(conceptUri, RDFS.label, VAR_CONCEPT_RDFS_LABEL)
                .addOptional(conceptUri, DCTerms.title, VAR_CONCEPT_DCTERMS_TITLE)
                .addOptional(VAR_CHILD_CONCEPT, SKOS.prefLabel, VAR_CHILD_CONCEPT_PREF_LABEL)
                .addOptional(VAR_CHILD_CONCEPT, RDFS.label, VAR_CHILD_CONCEPT_RDFS_LABEL)
                .addOptional(VAR_CHILD_CONCEPT, DCTerms.title, VAR_CHILD_CONCEPT_DCTERMS_TITLE);
                //.addOptional(VAR_CONCEPT, RDF.value, VAR_CONCEPT_SIZE_VALUE)
    }

}

