package com.linkedpipes.lpa.backend.sparql.queries.timeline;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Schema;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Time;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.XSD;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

//ldwmi: https://github.com/ldvm/LDVMi/blob/eb3826aafa088b295103ddc235dd5989eb173789/src/app/model/rdf/sparql/timeline/query/IntervalQuery.scala
public class IntervalQueryProvider extends SelectSparqlQueryProvider {

    private Date start;
    private Date end;

    // VARIABLES
    public static final String VAR_INTERVAL = var("interval");
    public static final String VAR_START = var("start");
    public static final String VAR_END = var("end");


    public IntervalQueryProvider(){
        this.start = null;
        this.end = null;
    }

    public IntervalQueryProvider(Date start, Date end){
        this.start = start;
        this.end = end;
    }

    @NotNull
    @Override
    public SelectBuilder addPrefixes(@NotNull SelectBuilder builder) {
        return builder
                .addPrefix(Prefixes.TIME_PREFIX, Time.uri)
                .addPrefix(Prefixes.SCHEMA_PREFIX, Schema.uri)
                .addPrefix(Prefixes.XSD_PREFIX, XSD.getURI());
    }

    @NotNull
    @Override
    public SelectBuilder addVars(@NotNull SelectBuilder builder) {
        return builder
                .setDistinct(true)
                .addVar(VAR_INTERVAL)
                .addVar(VAR_START)
                .addVar(VAR_END);
    }

    @NotNull
    @Override
    public SelectBuilder addWheres(@NotNull SelectBuilder builder) throws ParseException {
        return builder
                .addWhere(VAR_INTERVAL, Schema.startDate, VAR_START)
                .addWhere(VAR_INTERVAL, Schema.endDate, VAR_END);
                //.addWhere(VAR_INTERVAL, Time.hasBeginning, VAR_START)
                //.addWhere(VAR_INTERVAL, Time.hasEnd, VAR_END);
    }

    @NotNull
    @Override
    public SelectBuilder addFilters(@NotNull SelectBuilder builder) throws ParseException {
        if(start != null) {
            builder.addFilter(VAR_START + " > " + SparqlUtils.formatXSDDate(start));
        }

        if(end != null) {
            builder.addFilter(VAR_END + " < " + SparqlUtils.formatXSDDate(end));
        }

        return builder;
    }

    @NotNull
    @Override
    public SelectBuilder addOptionals(@NotNull SelectBuilder builder) {
        return builder
                .addGroupBy(VAR_INTERVAL)
                .addGroupBy(VAR_START)
                .addGroupBy(VAR_END);
    }
}
