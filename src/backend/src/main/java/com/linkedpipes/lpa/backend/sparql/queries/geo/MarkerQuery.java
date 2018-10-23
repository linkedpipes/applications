package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.vocabulary.SKOS;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQuery;
import org.apache.jena.arq.querybuilder.SelectBuilder;

public class MarkerQuery implements SparqlQuery {

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SKOS_PREFIX_URL = new SKOS().getPrefixURL();
    private static final String SCHEMA_PREFIX = "s";
    private static final String SCHEMA_PREFIX_URL = "http://schema.org/";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String RDFS_PREFIX_URL = "http://www.w3.org/2000/01/rdf-schema#";

    // VARIABLES
    private static final String S = "?s";
    private static final String G = "?g";
    private static final String LAT = "?lat";
    private static final String LNG = "?lng";
    private static final String SPL = "?spl";
    private static final String L = "?l";
    private static final String SN = "?sn";
    private static final String ST = "?st";
    private static final String SD = "?sd";

    // PREDICATES
    private static final String GEO = SCHEMA_PREFIX + ":geo";
    private static final String LATITUDE = SCHEMA_PREFIX + ":latitude";
    private static final String LONGITUDE = SCHEMA_PREFIX + ":longitude";
    private static final String PREF_LABEL = SKOS_PREFIX + ":prefLabel";
    private static final String LABEL = RDFS_PREFIX + ":label";
    private static final String NOTATION = SKOS_PREFIX + ":notation";
    private static final String NAME = SCHEMA_PREFIX + ":name";
    private static final String DESCRIPTION = SCHEMA_PREFIX + ":description";

    public String get(){
        return new SelectBuilder()

                .addPrefix(SKOS_PREFIX, SKOS_PREFIX_URL)
                .addPrefix(SCHEMA_PREFIX, SCHEMA_PREFIX_URL)
                .addPrefix(RDFS_PREFIX, RDFS_PREFIX_URL)

                .addVar(S)
                .addVar(LAT)
                .addVar(LNG)
                .addVar(SPL)
                .addVar(L)
                .addVar(SN)
                .addVar(ST)
                .addVar(SD)

                .addWhere(S, GEO, G)
                .addWhere(G, LATITUDE, LAT)
                .addWhere(G, LONGITUDE, LNG)

                .addOptional(S, PREF_LABEL, SPL)
                .addOptional(S, LABEL, L)
                .addOptional(S, NOTATION, SN)
                .addOptional(S, NAME, ST)
                .addOptional(S, DESCRIPTION, SD)

                //TODO also add filter restrictions once filter data is passed to method

                .buildString();
    }

    private void getFilterConditions(){
        //TODO
    }

    public static void main(String[] args) {
        String query = new MarkerQuery().get();
        System.out.println("---------------------");
        System.out.println(query);
        System.out.println("---------------------");
    }

}
