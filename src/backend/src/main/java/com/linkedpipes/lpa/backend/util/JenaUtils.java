package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.apache.jena.query.*;
import org.apache.jena.update.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.function.Function;

public final class JenaUtils {

    private static final String ENDPOINT = Application.getConfig().getString(ApplicationPropertyKeys.VirtuosoQueryEndpoint);

    public static <R> R withQueryExecution(Query query, Function<QueryExecution, R> action) throws LpAppsException {
        List<String> graphNames = query.getGraphURIs();
        if (graphNames.size() == 1 && !graphExists(graphNames.get(0))) {
            throw new LpAppsException(HttpStatus.NOT_FOUND, "Named graph does not exist.");
        }

        try (QueryExecution queryExecution = QueryExecutionFactory.sparqlService(ENDPOINT, query)) {
            return action.apply(queryExecution);
        }
    }

    public static boolean graphExists(String graphName) {
        QueryExecution queryExecution = QueryExecutionFactory.sparqlService(ENDPOINT, String.format("ASK WHERE { GRAPH <%s> { ?s ?p ?o } }", graphName));
        return queryExecution.execAsk();
    }

    public static void deleteGraph(String graphName) {
        UpdateRequest request = UpdateFactory.create() ;
        request.add(String.format("DROP SILENT GRAPH <%s>", graphName));
        UpdateExecutionFactory.createRemote(request, ENDPOINT).execute();
    }
}
