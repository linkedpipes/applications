package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.arq.querybuilder.WhereBuilder;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

public class SchemeQueryProvider extends ConstructSparqlQueryProvider {

    private String schemeUri;

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String RDF_PREFIX = "rdf";

    // VARIABLES
    public static final String VAR_SCHEME_PREF_LABEL = var("s_spl");
    public static final String VAR_SCHEME_RDFS_LABEL = var("s_lab");
    public static final String VAR_SCHEME_DCTERMS_TITLE = var("s_dctt");
    public static final String VAR_CONCEPT = var("c");
    public static final String VAR_CONCEPT_PREF_LABEL = var("c_spl");
    public static final String VAR_CONCEPT_SIZE_VALUE = var("c_val");
    public static final String VAR_CONCEPT_SKOS_BROADER = var("c_broader");
    public static final String VAR_NARROWER = var("n");
    public static final String VAR_NARROWER_PREF_LABEL = var("n_spl");
    public static final String VAR_NARROWER_DCTERMS_TITLE = var("n_dctt");
    public static final String VAR_NARROWER_SKOS_BROADER = var("n_broader");
    public static final String VAR_BROADER = var("b");
    public static final String VAR_BROADER_PREF_LABEL = var("b_spl");
    public static final String VAR_BROADER_DCTERMS_TITLE = var("b_dctt");

    public SchemeQueryProvider(String schemeUri){
        this.schemeUri = SparqlUtils.formatUri(schemeUri);
    }

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
                .addConstruct(schemeUri, SKOS.prefLabel, VAR_SCHEME_PREF_LABEL)
                .addConstruct(schemeUri, RDFS.label, VAR_SCHEME_RDFS_LABEL)
                .addConstruct(schemeUri, DCTerms.title, VAR_SCHEME_DCTERMS_TITLE)
                .addConstruct(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, RDF.value, VAR_CONCEPT_SIZE_VALUE)
                .addConstruct(VAR_CONCEPT, SKOS.inScheme, schemeUri)
                .addConstruct(VAR_CONCEPT, SKOS.broader, VAR_CONCEPT_SKOS_BROADER)
                .addConstruct(VAR_BROADER, RDF.type, SKOS.Concept)
                .addConstruct(VAR_BROADER, DCTerms.title, VAR_BROADER_DCTERMS_TITLE)
                .addConstruct(VAR_BROADER, SKOS.prefLabel, VAR_BROADER_PREF_LABEL)
                .addConstruct(VAR_NARROWER, RDF.type, SKOS.Concept)
                .addConstruct(VAR_NARROWER, DCTerms.title, VAR_NARROWER_DCTERMS_TITLE)
                .addConstruct(VAR_NARROWER, SKOS.prefLabel, VAR_NARROWER_PREF_LABEL)
                .addConstruct(VAR_NARROWER, SKOS.broader, VAR_NARROWER_SKOS_BROADER);
    }

    @Override
    protected ConstructBuilder addWheres(ConstructBuilder builder) {
        //TODO test below
        return builder
                .addOptional(schemeUri, SKOS.prefLabel, VAR_SCHEME_PREF_LABEL)
                .addOptional(schemeUri, RDFS.label, VAR_SCHEME_RDFS_LABEL)
                .addOptional(schemeUri, DCTerms.title, VAR_SCHEME_DCTERMS_TITLE)
                .addUnion(broaderPattern(SKOS.broader))
                .addUnion(broaderPattern(SKOS.broaderTransitive))
                .addUnion(narrowerPattern(SKOS.narrower))
                .addUnion(narrowerPattern(SKOS.narrowerTransitive));
    }

    private WhereBuilder broaderPattern(Property property) {
        WhereBuilder broaderPatternBuilder = new WhereBuilder();
        return broaderPatternBuilder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, schemeUri)
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addOptional(VAR_CONCEPT, RDF.value, VAR_CONCEPT_SIZE_VALUE)
                .addOptional(new WhereBuilder()
                                .addWhere(VAR_CONCEPT, property, VAR_BROADER)
                                .addWhere(VAR_BROADER, RDF.type, SKOS.Concept)
                                .addOptional(VAR_BROADER, DCTerms.title, VAR_BROADER_DCTERMS_TITLE)
                                .addOptional(VAR_BROADER, SKOS.prefLabel, VAR_BROADER_PREF_LABEL));
    }

    private WhereBuilder narrowerPattern(Property property) {
        WhereBuilder narrowerPatternBuilder = new WhereBuilder();
        return narrowerPatternBuilder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, schemeUri)
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_CONCEPT_PREF_LABEL)
                .addOptional(VAR_CONCEPT, RDF.value, VAR_CONCEPT_SIZE_VALUE)
                .addOptional(new WhereBuilder()
                        .addWhere(VAR_CONCEPT, property, VAR_NARROWER)
                        .addWhere(VAR_NARROWER, RDF.type, SKOS.Concept)
                        .addOptional(VAR_NARROWER, DCTerms.title, VAR_NARROWER_DCTERMS_TITLE)
                        .addOptional(VAR_NARROWER, SKOS.prefLabel, VAR_NARROWER_PREF_LABEL));
    }
}
