package com.linkedpipes.lpa.backend.sparql.queries.timeline;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Time;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.XSD;
import org.jetbrains.annotations.NotNull;

import java.util.Date;

//ldwmi: https://github.com/ldvm/LDVMi/blob/eb3826aafa088b295103ddc235dd5989eb173789/src/app/model/rdf/sparql/timeline/query/InstantQuery.scala
public class InstantQueryProvider extends SelectSparqlQueryProvider {

    private Date start;
    private Date end;

    // VARIABLES
    public static final String VAR_INSTANT = var("instant");
    public static final String VAR_DATE = var("date");
    public static final String VAR_TITLE = var("title");

    public InstantQueryProvider(){
        this.start = null;
        this.end = null;
    }

    public InstantQueryProvider(Date start, Date end){
        this.start = start;
        this.end = end;
    }

    @NotNull
    @Override
    public SelectBuilder addPrefixes(@NotNull SelectBuilder builder) {
        return builder
                .addPrefix(Prefixes.TIME_PREFIX, Time.uri)
                .addPrefix(Prefixes.DCTERMS_PREFIX, DCTerms.getURI())
                .addPrefix(Prefixes.XSD_PREFIX, XSD.getURI());
    }

    @NotNull
    @Override
    public SelectBuilder addVars(@NotNull SelectBuilder builder) {
        return builder
                .setDistinct(true)
                .addVar(VAR_INSTANT)
                .addVar(VAR_DATE);
    }

    @NotNull
    @Override
    public SelectBuilder addWheres(@NotNull SelectBuilder builder) {
        return builder
                .addWhere(VAR_INSTANT, DCTerms.date, VAR_DATE);
                //.addWhere(VAR_INSTANT, Time.inDateTime, VAR_DATE);
    }

    @NotNull
    @Override
    public SelectBuilder addOptionals(@NotNull SelectBuilder builder) {
        return builder
                .addOptional(VAR_INSTANT, DCTerms.title, VAR_TITLE);
    }

    @NotNull
    @Override
    public SelectBuilder addFilters(@NotNull SelectBuilder builder) throws ParseException {
        if(start != null) {
            builder.addFilter(VAR_DATE + " > " + SparqlUtils.formatXSDDate(start));
        }

        if(end != null) {
            builder.addFilter(VAR_DATE + " < " + SparqlUtils.formatXSDDate(end));
        }

        return builder;
    }

    @NotNull
    @Override
    public SelectBuilder addGroupBy(@NotNull SelectBuilder builder) {
        return builder
                .addGroupBy(VAR_INSTANT)
                .addGroupBy(VAR_DATE);
    }
}
