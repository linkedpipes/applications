package com.linkedpipes.lpa.backend.services.rgml;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.enums.EdgeDirection;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPA;
import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.EdgesExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.GraphExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.NodesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.EdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.GraphQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.IncidentEdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.NodesQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

@Service
public class RgmlService {

    //TODO
    private static final Logger log = LoggerFactory.getLogger(RgmlService.class);
    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    @PostConstruct
    public void createDummyData() {
        log.info("Filling our Virtuoso with dummy RGML data...");

        Map<String, Map<String, Integer>> messagesByUser = getMessagesByUser();
        Map<String, Map<String, Integer>> messagesByGroup = groupRandomly(messagesByUser);
        putTtlToVirtuoso(TtlGenerator.createRgmlGraph(messagesByGroup));

        log.info("Done!");
    }

    @NotNull
    private static Map<String, Map<String, Integer>> getMessagesByUser() {
        Map<String, Map<String, Integer>> userGraph = new HashMap<>();
        String[] lines = Objects.requireNonNull(
                new RestTemplate()
                        .getForObject("http://opsahl.co.uk/tnet/datasets/OClinks_w.txt", String.class))
                .split("\\r?\\n|\\r");
        Arrays.stream(lines)
                .filter(s -> !s.isEmpty())
                .map(s -> s.split("\\s+"))
                .forEach(line -> {
                    String source = line[0],
                            target = line[1];
                    int weight = Integer.parseInt(line[2]);
                    userGraph.computeIfAbsent(source, s -> new HashMap<>());
                    userGraph.get(source).put(target, weight);
                });
        return userGraph;
    }

    private static Map<String, Map<String, Integer>> groupRandomly(Map<String, Map<String, Integer>> messagesByUser) {
        Set<String> allUsers = new HashSet<>(messagesByUser.keySet());
        messagesByUser.values()
                .stream()
                .map(Map::keySet)
                .forEach(allUsers::addAll);

        Random random = new Random(0xc0ffee);
        Map<String, String> usersToGroups = allUsers.stream()
                .map(s -> Map.entry(s, String.valueOf(random.nextInt(6))))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        Map<String, Map<String, Integer>> messagesByGroup = new HashMap<>();
        for (var entry : messagesByUser.entrySet()) {
            String source = usersToGroups.get(entry.getKey());
            for (var innerEntry : entry.getValue().entrySet()) {
                String target = usersToGroups.get(innerEntry.getKey());
                int weight = innerEntry.getValue();

                Map<String, Integer> stringIntegerMap = messagesByGroup.computeIfAbsent(source, s -> new HashMap<>());
                stringIntegerMap.putIfAbsent(target, 0);
                stringIntegerMap.put(target, stringIntegerMap.get(target) + weight);
            }
        }

        return messagesByGroup;
    }

    private static void putTtlToVirtuoso(String ttlData) {
        LinkedMultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(HttpHeaders.CONTENT_TYPE, "text/turtle");
        HttpEntity<String> entity = new HttpEntity<>(ttlData, headers);
        URI uri = new DefaultUriBuilderFactory()
                .uriString(Application.getConfig().getString("lpa.virtuoso.crudEndpoint"))
                .queryParam("graph", LPA.Generated.uri)
                .build();
        new RestTemplate().put(uri, entity);
    }

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

    public List<Edge> getIncidentEdges(@Nullable String graphIri, @NotNull Graph graph, String nodeUri, EdgeDirection direction) {
        if (direction == null)
            return fetchAllEdges(graphIri, nodeUri);

        if (graph.directed) {
            return fetchEdges(graphIri, nodeUri, direction);
        }

        return fetchAllEdges(graphIri, nodeUri);
    }

    private List<Edge> fetchEdges(@Nullable String graphIri, String nodeUri, EdgeDirection direction){
        ConstructSparqlQueryProvider provider = new IncidentEdgesQueryProvider(nodeUri, direction);
        System.out.println(provider.get(graphIri));
        return EdgesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get(graphIri)));
    }

    private List<Edge> fetchAllEdges(@Nullable String graphIri, String nodeUri) {
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

    public double[][] getMatrix(@Nullable String graphIri, boolean useWeights, @NotNull List<String> nodeUris) {
        Graph graph = getGraph(graphIri);

        List<Edge> edges = nodeUris.stream()
                .map(uri -> getIncidentEdges(graphIri, graph, uri, null))
                .collect(joiningLists());

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
