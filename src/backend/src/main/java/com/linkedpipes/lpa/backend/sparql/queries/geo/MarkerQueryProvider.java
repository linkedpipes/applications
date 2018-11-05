package com.linkedpipes.lpa.backend.sparql.queries.geo;

import com.linkedpipes.lpa.backend.rdf.vocabulary.SCHEMA;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import com.linkedpipes.lpa.backend.sparql.VariableGenerator;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import java.util.List;
import java.util.Map;

//ldvmi: https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/geo/query/MarkerQuery.scala
public class MarkerQueryProvider extends SelectSparqlQueryProvider {

    private Map<String, List<ValueFilter>> filters;

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";
    private static final String SCHEMA_PREFIX = "s";
    private static final String RDFS_PREFIX = "rdfs";

    // VARIABLES
    public static final String VAR_SUBJECT = var("subject");
    public static final String VAR_GEO = var("g");
    public static final String VAR_LATITUDE = var("lat");
    public static final String VAR_LONGITUDE = var("lng");
    public static final String VAR_PREF_LABEL = var("spl");
    public static final String VAR_LABEL = var("lab");
    public static final String VAR_NOTATION = var("sn");
    public static final String VAR_NAME = var("st");
    public static final String VAR_DESCRIPTION = var("sd");

    public static final String[] LABEL_VARIABLES = {VAR_LABEL, VAR_PREF_LABEL, VAR_NAME, VAR_NOTATION};

    public MarkerQueryProvider(Map<String, List<ValueFilter>> filters){
        this.filters = filters;
    }

    @Override
    protected SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder
                .addPrefix(SKOS_PREFIX, SKOS.getURI())
                .addPrefix(SCHEMA_PREFIX, SCHEMA.uri)
                .addPrefix(RDFS_PREFIX, RDFS.getURI());
    }

    @Override
    protected SelectBuilder addVars(SelectBuilder builder) {
        return builder
                .addVar(VAR_SUBJECT)
                .addVar(VAR_LATITUDE)
                .addVar(VAR_LONGITUDE)
                .addVar(VAR_PREF_LABEL)
                .addVar(VAR_LABEL)
                .addVar(VAR_NOTATION)
                .addVar(VAR_NAME)
                .addVar(VAR_DESCRIPTION);
    }

    @Override
    protected SelectBuilder addWheres(SelectBuilder builder) {
        return builder
                .addWhere(VAR_SUBJECT, SCHEMA.geo, VAR_GEO)
                .addWhere(VAR_GEO, SCHEMA.latitude, VAR_LATITUDE)
                .addWhere(VAR_GEO, SCHEMA.longitude, VAR_LONGITUDE);
    }

    @Override
    protected SelectBuilder addOptionals(SelectBuilder builder) {
        return builder
                .addOptional(VAR_SUBJECT, SKOS.prefLabel, VAR_PREF_LABEL)
                .addOptional(VAR_SUBJECT, RDFS.label, VAR_LABEL)
                .addOptional(VAR_SUBJECT, SKOS.notation, VAR_NOTATION)
                .addOptional(VAR_SUBJECT, SCHEMA.name, VAR_NAME)
                .addOptional(VAR_SUBJECT, SCHEMA.description, VAR_DESCRIPTION);
    }

    @Override
    protected SelectBuilder addFilters(SelectBuilder builder) throws ParseException {
        VariableGenerator varGen = new VariableGenerator();
        for (Map.Entry<String, List<ValueFilter>> pair : filters.entrySet()) {
            String v = varGen.getVariable();
            builder.addWhere(VAR_SUBJECT, SparqlUtils.formatUri(pair.getKey()), v);

            for (ValueFilter filter : pair.getValue()) {
                String labelOrUri = getLabelOrUri(filter);
                if (StringUtils.isNotEmpty(labelOrUri)) {
                    builder.addFilter(v + " != " + labelOrUri);
                }
            }
        }
        return builder;
    }

    @Override
    protected SelectBuilder addAdditional(SelectBuilder builder) {
        return builder.setLimit(500);
    }

    private String getLabelOrUri(ValueFilter filter) {
        if (StringUtils.isNotEmpty(filter.uri)) {
            return SparqlUtils.formatUri(filter.uri);
        }
        else if (StringUtils.isNotEmpty(filter.label)) {
            return SparqlUtils.formatLabel(filter.label);
        }

        return null;
    }

}
