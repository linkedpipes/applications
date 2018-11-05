package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

public class ConceptsQueryProvider extends ConstructSparqlQueryProvider {
    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String RDF_PREFIX = "rdf";

    // VARIABLES
    public static final String VAR_CONCEPT = var("c");
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_BROADER = var("b");
    public static final String VAR_BROADER_TRANS = var("bt");
    public static final String VAR_NARROWER = var("n");
    public static final String VAR_NARROWER_TRANS = var("nt");

    @Override
    protected ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder
                .addPrefix(SKOS_PREFIX, SKOS.uri)
                .addPrefix(RDF_PREFIX, RDF.uri);
    }

    @Override
    protected ConstructBuilder addConstructs(ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addConstruct(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addConstruct(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addConstruct(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addConstruct(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS);
    }

    @Override
    protected ConstructBuilder addWheres(ConstructBuilder builder) {
        return builder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept);
    }

    @Override
    protected ConstructBuilder addOptionals(ConstructBuilder builder) {
        return builder
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addOptional(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addOptional(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addOptional(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addOptional(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS);
    }

}
