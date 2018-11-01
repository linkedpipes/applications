package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.Vocabularies;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.query.Query;
import org.apache.jena.sparql.lang.sparql_11.ParseException;

import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.pred;
import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.var;

public class GeoPropertiesQueryProvider implements SparqlQueryProvider {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SKOS_PREFIX_URL = Vocabularies.SKOS;
    private static final String SCHEMA_PREFIX = "s";
    private static final String SCHEMA_PREFIX_URL = Vocabularies.SCHEMA;
    private static final String RDFS_PREFIX = "rdfs";
    private static final String RDFS_PREFIX_URL = Vocabularies.RDFS;
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String DCTERMS_PREFIX_URL = Vocabularies.DCTERMS;
    private static final String RDF_PREFIX = "rdf";
    private static final String RDF_PREFIX_URL = Vocabularies.RDF;

    // VARIABLES
    public static final String VAR_SUBJECT = var("subject");
    public static final String VAR_SCHEME = var("scheme");
    public static final String VAR_GEO = var("g");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_NOTATION = var("sn");
    public static final String VAR_NAME = var("st");
    public static final String VAR_DESCRIPTION = var("sd");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_P = var("p");

    public static final String[] LABEL_VARIABLES = {VAR_RDFS_LABEL, VAR_PREF_LABEL, VAR_NAME, VAR_NOTATION, VAR_DCTERMS_TITLE};

    // PREDICATES
    private static final String PRED_GEO = pred(SCHEMA_PREFIX, "geo");
    private static final String PRED_INSCHEME = pred(SKOS_PREFIX, "inScheme");
    private static final String PRED_PREF_LABEL = pred(SKOS_PREFIX, "prefLabel");
    private static final String PRED_NOTATION = pred(SKOS_PREFIX, "notation");
    private static final String PRED_SCHEMA_TITLE = pred(SCHEMA_PREFIX, "title");
    private static final String PRED_DCTERMS_TITLE = pred(SCHEMA_PREFIX, "title");
    private static final String PRED_DESCRIPTION = pred(SCHEMA_PREFIX, "description");
    private static final String PRED_TYPE = pred(RDF_PREFIX, "type");
    private static final String PRED_RDFS_LABEL = pred(RDFS_PREFIX, "label");
    private static final String PRED_SEEALSO = pred(RDFS_PREFIX, "seeAlso");

    public Query get() {

        SelectBuilder builder = new SelectBuilder();

        try {
            builder.addPrefix(SKOS_PREFIX, SKOS_PREFIX_URL)
            .addPrefix(SCHEMA_PREFIX, SCHEMA_PREFIX_URL)
            .addPrefix(RDFS_PREFIX, RDFS_PREFIX_URL)
            .addPrefix(DCTERMS_PREFIX, DCTERMS_PREFIX_URL)
            .addPrefix(RDF_PREFIX, RDF_PREFIX_URL)

            .setDistinct(true)

            .addVar(VAR_P)
            .addVar(VAR_PREF_LABEL)
            .addVar(VAR_RDFS_LABEL)
            .addVar(VAR_NOTATION)
            .addVar(VAR_SCHEME)

            //TODO check if passing blank node as below works...
            .addWhere(VAR_SUBJECT, PRED_GEO, NodeFactory.createBlankNode())
            .addWhere(VAR_SUBJECT, VAR_P, var("o"))
            .addWhere(var("o"), PRED_INSCHEME, VAR_SCHEME)

            .addOptional(VAR_SCHEME, PRED_PREF_LABEL, VAR_PREF_LABEL)
            .addOptional(VAR_SCHEME, PRED_RDFS_LABEL, VAR_RDFS_LABEL)
            .addOptional(VAR_SCHEME, PRED_NOTATION, VAR_NOTATION)
            .addOptional(VAR_SCHEME, PRED_DCTERMS_TITLE, VAR_DCTERMS_TITLE)
            .addOptional(VAR_SCHEME, PRED_SCHEMA_TITLE, VAR_NAME)
            .addOptional(VAR_SCHEME, PRED_DESCRIPTION, VAR_DESCRIPTION)

            .addFilter(VAR_P + "!=" + PRED_PREF_LABEL)
            .addFilter(VAR_P + "!=" + PRED_GEO)
            .addFilter(VAR_P + "!=" + PRED_TYPE)
            .addFilter(VAR_P + "!=" + PRED_SEEALSO)

            .setLimit(1000);
        }
        catch (ParseException e) {
            //TODO log exception
        }

        return builder.build();
    }

    public static void main(String[] args) {
        GeoPropertiesQueryProvider prov = new GeoPropertiesQueryProvider();
        System.out.print(prov.get().toString());
    }
}
