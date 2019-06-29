package com.linkedpipes.lpa.backend.services.rgml;

import com.linkedpipes.lpa.backend.entities.EdgeDirection;
import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.EdgesExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.GraphExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.NodesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.EdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.GraphQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.IncidentEdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.NodesQueryProvider;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.DoubleStream;

@Service
public class RgmlService {

    /** Get a graph resource (resource of type rgml:Graph).
     *
     * If there are multiple resources of this type available, return an arbitrary one. For this
     * reason, only one graph should exist in the data set.
     *
     */
    public Graph getGraph(@Nullable String graphIri) throws LpAppsException {
        SelectSparqlQueryProvider provider = new GraphQueryProvider();
        return JenaUtils.withQueryExecution(provider.get(graphIri), GraphExtractor::extract);
    }

    /** Get all edges (resources of type rgml:Edge). */
    public List<Edge> getEdges(@Nullable String graphIri) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new EdgesQueryProvider();
        return JenaUtils.withQueryExecution(provider.get(graphIri), EdgesExtractor::extract);
    }

    private List<Edge> getIncidentEdges(@Nullable String graphIri, @NotNull Graph graph, String nodeUri, EdgeDirection direction) throws LpAppsException {
        if (direction == null)
            return fetchAllEdges(graphIri, nodeUri);

        if (graph.directed) {
            return fetchEdges(graphIri, nodeUri, direction);
        }

        return fetchAllEdges(graphIri, nodeUri);
    }

    private List<Edge> fetchEdges(@Nullable String graphIri, String nodeUri, EdgeDirection direction) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new IncidentEdgesQueryProvider(nodeUri, direction);
        return JenaUtils.withQueryExecution(provider.get(graphIri), EdgesExtractor::extract);
    }

    private List<Edge> fetchAllEdges(@Nullable String graphIri, String nodeUri) throws LpAppsException {
        List<Edge> edges = fetchEdges(graphIri, nodeUri, EdgeDirection.INCOMING);
        edges.addAll(fetchEdges(graphIri, nodeUri, EdgeDirection.OUTGOING));
        return edges;
    }

    public List<Node> getNodes(@Nullable String graphIri, Integer limit, Integer offset) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new NodesQueryProvider(limit, offset);
        return JenaUtils.withQueryExecution(provider.get(graphIri), NodesExtractor::extract);
    }

    public List<Node> getNodesByUris(@Nullable String graphIri, List<String> nodeUris) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new NodesQueryProvider(nodeUris);
        return JenaUtils.withQueryExecution(provider.get(graphIri), NodesExtractor::extract);
    }

    public double[][] getMatrix(@Nullable String graphIri, boolean useWeights, @NotNull List<String> nodeUris) throws LpAppsException {
        Graph graph = getGraph(graphIri);

        List<Edge> edges = new ArrayList<>();
        for(String nodeUri: nodeUris){
            edges.addAll(getIncidentEdges(graphIri, graph, nodeUri, null));
        }

        Map<String, Map<String, Double>> matrix = new HashMap<>();

        edges.forEach(edge -> {
            if (nodeUris.contains(edge.source) && nodeUris.contains(edge.target)) {
                addEdgeToMatrix(matrix, edge.source, edge.target, useWeights, edge.weight);

                if (!graph.directed) {
                    addEdgeToMatrix(matrix, edge.target, edge.source, useWeights, edge.weight);
                }
            }
        });

        // Let's remove the uris and create a pure matrix of doubles (2d array). We must be careful to maintain the order.
        return nodeUris.stream()
                .map(source -> nodeUris.stream()
                        .mapToDouble(target -> matrix.getOrDefault(source, Collections.emptyMap())
                                .getOrDefault(target, 0.0)))
                .map(DoubleStream::toArray)
                .toArray(double[][]::new);
    }

    private <E> Collector<List<E>, ?, List<E>> joiningLists() {
        return Collector.of(ArrayList::new, List::addAll, (l1, l2) -> {
            l1.addAll(l2);
            return l1;
        });
    }

    private void addEdgeToMatrix(Map<String, Map<String, Double>> matrix, String source, String target, boolean useWeights, Double weight){
            var counts = matrix.getOrDefault(source, new HashMap<>());
        if (!useWeights)
                weight = 1.0;
            counts.put(target, (counts.getOrDefault(target, 0.0) + weight));
            matrix.put(source, counts);
    }

}
