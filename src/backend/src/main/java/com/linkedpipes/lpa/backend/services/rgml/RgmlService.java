package com.linkedpipes.lpa.backend.services.rgml;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.enums.EdgeDirection;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.EdgesExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.GraphExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.NodesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.EdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.GraphQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.IncidentEdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.NodesQueryProvider;
import jdk.nashorn.api.tree.SimpleTreeVisitorES5_1;
import org.apache.jena.query.QueryExecutionFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class RgmlService {
    //TODO
    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    /** Get a graph resource (resource of type rgml:Graph).
     *
     * If there are multiple resources of this type available, return an arbitrary one. For this
     * reason, only one graph should exist in the data set.
     *
     */
    public Graph getGraph(@Nullable String graphIri) {
        SelectSparqlQueryProvider provider = new GraphQueryProvider();
        System.out.println(provider.get(graphIri));
        return GraphExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    /** Get all edges (resources of type rgml:Edge). */
    public List<Edge> getEdges(@Nullable String graphIri) {
        ConstructSparqlQueryProvider provider = new EdgesQueryProvider();
        System.out.println(provider.get(graphIri));
        return EdgesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    public List<Edge> getIncidentEdges(@Nullable String graphIri, String nodeUri, EdgeDirection direction){
        if(direction == null)
            return fetchAllEdges(graphIri, nodeUri);

        //TODO possibly pass graph directly to this function instead of re-calling it here
        Graph graph = getGraph(graphIri);

        if(graph.directed)
            return fetchEdges(graphIri, nodeUri, direction);

        return fetchAllEdges(graphIri, nodeUri);
    }

    private List<Edge> fetchEdges(@Nullable String graphIri, String nodeUri, EdgeDirection direction){
        ConstructSparqlQueryProvider provider = new IncidentEdgesQueryProvider(nodeUri, direction);
        System.out.println(provider.get(graphIri));
        return EdgesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    private List<Edge> fetchAllEdges(@Nullable String graphIri, String nodeUri){
        List<Edge> edges = fetchEdges(graphIri, nodeUri, EdgeDirection.INCOMING);
        edges.addAll(fetchEdges(graphIri, nodeUri, EdgeDirection.OUTGOING));
        return edges;
    }

    public List<Node> getNodes(@Nullable String graphIri, Integer limit, Integer offset) {
        ConstructSparqlQueryProvider provider = new NodesQueryProvider(limit, offset);
        System.out.println(provider.get(graphIri));
        return NodesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    public List<Node> getNodesByUris(@Nullable String graphIri, List<String> nodeUris) {
        ConstructSparqlQueryProvider provider = new NodesQueryProvider(nodeUris);
        System.out.println(provider.get(graphIri));
        return NodesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    public double[][] getMatrix(@Nullable String graphIri, @NotNull boolean useWeights, @NotNull List<String> nodeUris) {
        Graph graph = getGraph(graphIri);

        List<Edge> edges = nodeUris.stream().map(uri -> getIncidentEdges(graphIri, uri, null))
                .reduce((result, e) -> Stream.of(result, e).flatMap(x -> x.stream())
                        .collect(Collectors.toList())).orElse(new ArrayList<Edge>());

        Map<String, Map<String, Double>> matrix = new HashMap<>();

        edges.forEach(edge -> {
            if (nodeUris.contains(edge.source) && nodeUris.contains(edge.target)) {
                addEdgeToMatrix(matrix, edge.source, edge.target, useWeights, edge.weight);

                if (!graph.directed) {
                    addEdgeToMatrix(matrix, edge.target, edge.source, useWeights, edge.weight);
                }
            }
        });

        Stream<String> nodeUrisStream = nodeUris.stream();
        return nodeUrisStream.map(source ->
                nodeUrisStream.map(target ->
                    matrix.getOrDefault(source, new HashMap<>()).getOrDefault(target, 0.0))
        ).toArray(double[][]::new);
    }

    private void addEdgeToMatrix(Map<String, Map<String, Double>> matrix, String source, String target, boolean useWeights, Double weight){
            var counts = matrix.getOrDefault(source, new HashMap<>());
            if(!useWeights)
                weight = 1.0;
            counts.put(target, (counts.getOrDefault(target, 0.0) + weight));
            matrix.put(source, counts);
    }

}
