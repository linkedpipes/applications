package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.query.Query;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import static com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider.var;

public class SchemesQueryProvider implements SparqlQueryProvider {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String DCTERMS_PREFIX = "dcterms";
    private static final String RDF_PREFIX = "rdf";

    // VARIABLES
    public static final String VAR_SCHEME = var("s");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_RDFS_LABEL = var("lab");
    public static final String VAR_DCTERMS_TITLE = var("dctt");
    public static final String VAR_CONCEPT = var("c");

    public Query get() {

        ConstructBuilder builder = new ConstructBuilder();

        builder.addPrefix(SKOS_PREFIX, SKOS.uri)
                .addPrefix(RDFS_PREFIX, RDFS.uri)
                .addPrefix(DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(RDF_PREFIX, RDF.uri)

                .addConstruct(VAR_SCHEME, RDF.type, SKOS.ConceptScheme)
                .addConstruct(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addConstruct(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE)
                .addConstruct(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)

                .addWhere(VAR_CONCEPT, RDF.type, SKOS.Concept)
                .addWhere(VAR_CONCEPT, SKOS.inScheme, VAR_SCHEME)
                .addWhere(VAR_SCHEME, RDF.type, SKOS.ConceptScheme)

                .addOptional(VAR_SCHEME, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SCHEME, RDFS.label, VAR_RDFS_LABEL)
                .addOptional(VAR_SCHEME, DCTerms.title, VAR_DCTERMS_TITLE);

        return builder.build();
    }

    public static void main(String[] args) {
        SchemesQueryProvider prov = new SchemesQueryProvider();
        System.out.print(prov.get().toString());
    }
}
