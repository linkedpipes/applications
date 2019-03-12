package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class ConceptsQueryProvider extends ConstructSparqlQueryProvider {

    // VARIABLES
    public static final String VAR_CONCEPT = var("c");
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_BROADER = var("b");
    public static final String VAR_BROADER_TRANS = var("bt");
    public static final String VAR_NARROWER = var("n");
    public static final String VAR_NARROWER_TRANS = var("nt");

    @NotNull
    @Override
    protected ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.SKOS_PREFIX, SKOS.uri)
                .addPrefix(Prefixes.RDF_PREFIX, RDF.uri);
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addConstruct(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addConstruct(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addConstruct(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addConstruct(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS);
    }

    @NotNull
    @Override
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder
                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept);
    }

    @NotNull
    @Override
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addOptional(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addOptional(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addOptional(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addOptional(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS);
    }

}
