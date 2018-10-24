package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.vocabulary.SKOS;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import com.linkedpipes.lpa.backend.sparql.VariableGenerator;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQuery;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;

import java.beans.Expression;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//ldvmi: https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/geo/query/MarkerQuery.scala
public class MarkerQuery implements SparqlQuery {

    Map<String, List<ValueFilter>> filters;

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

    public MarkerQuery(Map<String, List<ValueFilter>> filters){
        this.filters = filters;
    }

    public String get() {
        SelectBuilder builder = new SelectBuilder()

                .addPrefix(SKOS_PREFIX, SparqlUtils.formatUri(SKOS_PREFIX_URL))
                .addPrefix(SCHEMA_PREFIX, SparqlUtils.formatUri(SCHEMA_PREFIX_URL))
                .addPrefix(RDFS_PREFIX, SparqlUtils.formatUri(RDFS_PREFIX_URL))

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
                .addOptional(S, DESCRIPTION, SD);

        builder = appendFilterConditions(builder);

        return builder.buildString();
    }

    private SelectBuilder appendFilterConditions(SelectBuilder builder) {
        VariableGenerator varGen = new VariableGenerator();
        for (Map.Entry<String,List<ValueFilter>> pair : filters.entrySet()){
            String v = varGen.getVariable();
            builder.addWhere(S, SparqlUtils.formatUri(pair.getKey()), v);

            for(ValueFilter filter : pair.getValue()) {
                String labelOrUri = getLabelOrUri(filter);
                if(StringUtils.isNotEmpty(labelOrUri)) {
                    try {
                        builder.addFilter(v + " != " + labelOrUri);
                    }
                    catch(ParseException e){
                        //TODO log exception
                    }
                }
            }
        }
        return builder;
    }

    private String getLabelOrUri(ValueFilter filter){
        if(StringUtils.isNotEmpty(filter.uri)){
            return SparqlUtils.formatUri(filter.uri);
        }
        else if(StringUtils.isNotEmpty(filter.label)){
            return SparqlUtils.formatLabel(filter.label);
        }

        return null;
    }

    public static void main(String[] args) {
        String query = new MarkerQuery(new HashMap<>()).get();
        System.out.println("---------------------");
        System.out.println(query);
        System.out.println("---------------------");
    }

}
