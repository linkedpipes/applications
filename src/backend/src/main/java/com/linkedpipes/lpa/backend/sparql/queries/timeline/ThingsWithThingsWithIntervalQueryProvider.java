package com.linkedpipes.lpa.backend.sparql.queries.timeline;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Schema;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Time;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.XSD;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

public class ThingsWithThingsWithIntervalQueryProvider extends SelectSparqlQueryProvider {
    private Date start;
    private Date end;

    // VARIABLES
    public static final String VAR_DISTANT_OBJECT = var("distantobject");
    public static final String VAR_HAS_OBJECT = var("hasObject");
    public static final String VAR_OBJECT = var("object");
    public static final String VAR_HAS_INTERVAL = var("hasInterval");
    public static final String VAR_INTERVAL = var("interval");
    public static final String VAR_START = var("start");
    public static final String VAR_END = var("end");
    public static final String VAR_TITLE = var("title");

    public ThingsWithThingsWithIntervalQueryProvider(){
        this.start = null;
        this.end = null;
    }

    public ThingsWithThingsWithIntervalQueryProvider(Date start, Date end){
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
    public SelectBuilder addWheres(@NotNull SelectBuilder builder) {
        return builder
                .addWhere(VAR_DISTANT_OBJECT, VAR_HAS_OBJECT, VAR_OBJECT)
                .addWhere(VAR_OBJECT, VAR_HAS_INTERVAL, VAR_INTERVAL)
                .addWhere(VAR_INTERVAL, Schema.startDate, VAR_START)
                .addWhere(VAR_INTERVAL, Schema.endDate, VAR_END);
    }

    @NotNull
    @Override
    public SelectBuilder addOptionals(@NotNull SelectBuilder builder) {
        return builder
                .addOptional(VAR_INTERVAL, DCTerms.title, VAR_TITLE);
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
    public SelectBuilder addGroupBy(@NotNull SelectBuilder builder) {
        return builder
                .addGroupBy(VAR_INTERVAL)
                .addGroupBy(VAR_START)
                .addGroupBy(VAR_END);
    }
}
