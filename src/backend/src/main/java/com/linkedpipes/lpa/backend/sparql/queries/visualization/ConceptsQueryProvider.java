package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.pred;
import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.var;

public class ConceptsQueryProvider implements SparqlQueryProvider {
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

    public Query get() {

        ConstructBuilder builder = new ConstructBuilder();

        builder.addPrefix(SKOS_PREFIX, SKOS.uri)
                .addPrefix(RDF_PREFIX, RDF.uri)

                .addConstruct(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addConstruct(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addConstruct(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addConstruct(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addConstruct(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addConstruct(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS)

                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)

                .addOptional(VAR_CONCEPT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addOptional(VAR_CONCEPT, SKOS.broader, VAR_BROADER)
                .addOptional(VAR_CONCEPT, SKOS.broaderTransitive, VAR_BROADER_TRANS)
                .addOptional(VAR_CONCEPT, SKOS.narrower, VAR_NARROWER)
                .addOptional(VAR_CONCEPT, SKOS.narrowerTransitive, VAR_NARROWER_TRANS);

        return builder.build();
    }

    public static void main(String[] args) {
        ConceptsQueryProvider prov = new ConceptsQueryProvider();
        System.out.println(SKOS.NAMESPACE.getLocalName());
        System.out.print(prov.get().toString());
    }
}
