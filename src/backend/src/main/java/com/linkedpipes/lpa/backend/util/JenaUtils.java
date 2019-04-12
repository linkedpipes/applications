package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;

import java.util.function.Function;

public final class JenaUtils {

    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    public static <R> R withQueryExecution(Query query, Function<QueryExecution, R> action) {
        try (QueryExecution queryExecution = QueryExecutionFactory.sparqlService(ENDPOINT, query)) {
            return action.apply(queryExecution);
        }
    }

}
