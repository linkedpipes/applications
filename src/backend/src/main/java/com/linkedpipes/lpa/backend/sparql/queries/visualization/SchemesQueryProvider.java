package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Vocabularies;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;

import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.pred;
import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.var;

public class SchemesQueryProvider implements SparqlQueryProvider {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SKOS_PREFIX_URL = Vocabularies.SKOS;
    private static final String RDFS_PREFIX = "rdfs";
    private static final String RDFS_PREFIX_URL = Vocabularies.RDFS;
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String DCTERMS_PREFIX_URL = Vocabularies.DCTERMS;
    private static final String RDF_PREFIX = "rdf";
    private static final String RDF_PREFIX_URL = Vocabularies.RDF;

    // VARIABLES
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_C = var("c");

    // PREDICATES
    private static final String PRED_SKOS_CONCEPT_SCHEME = pred(SKOS_PREFIX, "ConceptScheme");
    private static final String PRED_SKOS_CONCEPT = pred(SKOS_PREFIX, "Concept");
    private static final String PRED_INSCHEME = pred(SKOS_PREFIX, "inScheme");
    private static final String PRED_PREF_LABEL = pred(SKOS_PREFIX, "prefLabel");
    private static final String PRED_DCTERMS_TITLE = pred(DCTERMS_PREFIX, "title");
    private static final String PRED_RDFS_LABEL = pred(RDFS_PREFIX, "label");
    private static final String PRED_RDF_TYPE = pred(RDF_PREFIX, "type");

    public Query get() {

        ConstructBuilder builder = new ConstructBuilder();

        builder.addPrefix(SKOS_PREFIX, SKOS_PREFIX_URL)
                .addPrefix(RDFS_PREFIX, RDFS_PREFIX_URL)
                .addPrefix(DCTERMS_PREFIX, DCTERMS_PREFIX_URL)
                .addPrefix(RDF_PREFIX, RDF_PREFIX_URL)

                .addConstruct(VAR_SCHEME, PRED_RDF_TYPE, PRED_SKOS_CONCEPT_SCHEME)
                .addConstruct(VAR_SCHEME, PRED_PREF_LABEL, VAR_PREF_LABEL)
                .addConstruct(VAR_SCHEME, PRED_DCTERMS_TITLE, VAR_DCTERMS_TITLE)
                .addConstruct(VAR_SCHEME, PRED_RDFS_LABEL, VAR_RDFS_LABEL)

                .addWhere(VAR_C, PRED_RDF_TYPE, PRED_SKOS_CONCEPT)
                .addWhere(VAR_C, PRED_INSCHEME, VAR_SCHEME)
                .addWhere(VAR_SCHEME, PRED_RDF_TYPE, PRED_SKOS_CONCEPT_SCHEME)

                .addOptional(VAR_SCHEME, PRED_PREF_LABEL, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, PRED_RDFS_LABEL, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, PRED_DCTERMS_TITLE, VAR_DCTERMS_TITLE);

        return builder.build();
    }

    public static void main(String[] args) {
        SchemesQueryProvider prov = new SchemesQueryProvider();
        System.out.print(prov.get().toString());
    }
}
