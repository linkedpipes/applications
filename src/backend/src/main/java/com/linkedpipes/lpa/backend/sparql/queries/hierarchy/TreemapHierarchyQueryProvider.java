package com.linkedpipes.lpa.backend.sparql.queries.hierarchy;

import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

public class TreemapHierarchyQueryProvider extends ConstructSparqlQueryProvider {

    private static final String VAR_NODE = var("node");
    private static final String VAR_PREF_LABEL = var("prefLabel");
    private static final String VAR_PARENT = var("parent");
    private static final String VAR_NOTATION = var("notation");
    private static final String VAR_SCHEME = var("scheme");
    private static final String VAR_TITLE = var("title");

    private static final String SCHEME = "<http://linked.opendata.cz/resource/concept-scheme/cpv-2008>"; // TODO: 25.2.19 remove this hard-coded value after demo

    @Override
    @NotNull
    protected ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder.addPrefix("rdf", RDF.getURI())
                .addPrefix("skos", SKOS.getURI());
    }

    @Override
    @NotNull
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder.addConstruct(VAR_NODE, SKOS.notation, VAR_NOTATION)
                .addConstruct(VAR_NODE, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_NODE, SKOS.broader, VAR_PARENT)
                .addConstruct(VAR_NODE, SKOS.broader, VAR_SCHEME)
                .addConstruct(SCHEME, DCTerms.title, VAR_TITLE);
    }

    @Override
    @NotNull
    protected ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        return builder.addWhere(VAR_NODE, RDF.type, SKOS.Concept)
                .addWhere(VAR_NODE, SKOS.inScheme, SCHEME)
                .addWhere(SCHEME, RDF.type, SKOS.ConceptScheme);
    }

    @Override
    @NotNull
    protected ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder.addOptional(VAR_NODE, SKOS.notation, VAR_NOTATION)
                .addOptional(VAR_NODE, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_NODE, SKOS.broaderTransitive, VAR_PARENT)
                .addOptional(VAR_NODE, SKOS.topConceptOf, VAR_SCHEME)
                .addOptional(SCHEME, DCTerms.title, VAR_TITLE);
    }

}
