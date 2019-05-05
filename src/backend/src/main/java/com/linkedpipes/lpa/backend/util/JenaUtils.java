package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.apache.jena.query.Query;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import virtuoso.jena.driver.VirtGraph;
import virtuoso.jena.driver.VirtuosoQueryExecution;
import virtuoso.jena.driver.VirtuosoQueryExecutionFactory;

import java.util.List;
import java.util.function.Function;

public final class JenaUtils {

    private static final String VIRTUOSO_URL = Application.getConfig().getString("lpa.virtuoso.jdbcUrl");
    private static final String USERNAME = Application.getConfig().getString("lpa.virtuoso.username");
    private static final String PASSWORD = Application.getConfig().getString("lpa.virtuoso.password");

    public static <R> R withQueryExecution(
            @NotNull Query query,
            @NotNull Function<? super VirtuosoQueryExecution, ? extends R> action) throws LpAppsException {
        return withVirtuosoGraph(graph -> {
            List<String> graphNames = query.getGraphURIs();
            if (graphNames.size() == 1 && !namedGraphExists(graphNames.get(0), graph)) {
                throw new LpAppsException(HttpStatus.NOT_FOUND, "Named graph does not exist.");
            }

            try (VirtuosoQueryExecution queryExecution = VirtuosoQueryExecutionFactory.create(query, graph)) {
                return action.apply(queryExecution);
            }
        });
    }

    public static <R, X extends Throwable> R withVirtuosoGraph(@NotNull ThrowingFunction<? super VirtGraph, ? extends R, X> action) throws X {
        VirtGraph graph = new VirtGraph(VIRTUOSO_URL, USERNAME, PASSWORD);
        try (VirtGraphHolder holder = new VirtGraphHolder(graph)) {
            return action.apply(holder.graph);
        }
    }

    public static boolean namedGraphExists(@NotNull String graphName, @NotNull VirtGraph graph) {
        String query = String.format("ASK WHERE { GRAPH <%s> { ?s ?p ?o } }", graphName);
        try (VirtuosoQueryExecution queryExecution = VirtuosoQueryExecutionFactory.create(query, graph)) {
            return queryExecution.execAsk();
        }
    }

    private static class VirtGraphHolder implements AutoCloseable {

        @NotNull
        VirtGraph graph;

        VirtGraphHolder(@NotNull VirtGraph graph) {
            this.graph = graph;
        }

        @Override
        public void close() {
            graph.close();
        }

    }

}
