package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Vocabularies;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;

import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.pred;
import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.var;

public class ConceptsQueryProvider implements SparqlQueryProvider {
    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SKOS_PREFIX_URL = Vocabularies.SKOS;
    private static final String RDF_PREFIX = "rdf";
    private static final String RDF_PREFIX_URL = Vocabularies.RDF;

    // VARIABLES
    public static final String VAR_CONCEPT = var("c");
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_BROADER = var("b");
    public static final String VAR_BROADER_TRANS = var("bt");
    public static final String VAR_NARROWER = var("n");
    public static final String VAR_NARROWER_TRANS = var("nt");

    // PREDICATES
    private static final String PRED_SKOS_CONCEPT = pred(SKOS_PREFIX, "Concept");
    private static final String PRED_INSCHEME = pred(SKOS_PREFIX, "inScheme");
    private static final String PRED_PREF_LABEL = pred(SKOS_PREFIX, "prefLabel");
    private static final String PRED_RDF_TYPE = pred(RDF_PREFIX, "type");
    private static final String PRED_BROADER = pred(SKOS_PREFIX, "broader");
    private static final String PRED_BROADER_TRANS = pred(SKOS_PREFIX, "broaderTransitive");
    private static final String PRED_NARROWER = pred(SKOS_PREFIX, "narrower");
    private static final String PRED_NARROWER_TRANS = pred(SKOS_PREFIX, "narrowerTransitive");

    public Query get() {

        ConstructBuilder builder = new ConstructBuilder();

        builder.addPrefix(SKOS_PREFIX, SKOS_PREFIX_URL)
                .addPrefix(RDF_PREFIX, RDF_PREFIX_URL)

                .addConstruct(VAR_CONCEPT, PRED_RDF_TYPE, PRED_SKOS_CONCEPT)
                .addConstruct(VAR_CONCEPT, PRED_PREF_LABEL, VAR_PREF_LABEL)
                .addConstruct(VAR_CONCEPT, PRED_INSCHEME, VAR_SCHEME)
                .addConstruct(VAR_CONCEPT, PRED_BROADER, VAR_BROADER)
                .addConstruct(VAR_CONCEPT, PRED_BROADER_TRANS, VAR_BROADER_TRANS)
                .addConstruct(VAR_CONCEPT, PRED_NARROWER, VAR_NARROWER)
                .addConstruct(VAR_CONCEPT, PRED_NARROWER_TRANS, VAR_NARROWER_TRANS)

                .addWhere(VAR_CONCEPT, PRED_RDF_TYPE, PRED_SKOS_CONCEPT)

                .addOptional(VAR_CONCEPT, PRED_PREF_LABEL, VAR_PREF_LABEL)
                .addOptional(VAR_CONCEPT, PRED_INSCHEME, VAR_SCHEME)
                .addOptional(VAR_CONCEPT, PRED_BROADER, VAR_BROADER)
                .addOptional(VAR_CONCEPT, PRED_BROADER_TRANS, VAR_BROADER_TRANS)
                .addOptional(VAR_CONCEPT, PRED_NARROWER, VAR_NARROWER)
                .addOptional(VAR_CONCEPT, PRED_NARROWER_TRANS, VAR_NARROWER_TRANS);

        return builder.build();
    }

    public static void main(String[] args) {
        ConceptsQueryProvider prov = new ConceptsQueryProvider();
        System.out.print(prov.get().toString());
    }
}
