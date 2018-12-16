package com.linkedpipes.lpa.backend.services.rgml;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.EdgesExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.GraphExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.rgml.NodesExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.EdgesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.GraphQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.NodesQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;

import java.util.List;

public class RgmlService {
    //TODO
    private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");

    /** Get a graph resource (resource of type rgml:Graph).
     *
     * If there are multiple resources of this type available, return an arbitrary one. For this
     * reason, only one graph should exist in the data set.
     *
     */
    public static Graph getGraph() {
        SelectSparqlQueryProvider provider = new GraphQueryProvider();
        return GraphExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    /** Get all edges (resources of type rgml:Edge). */
    public static List<Edge> getEdges() {
        ConstructSparqlQueryProvider provider = new EdgesQueryProvider();
        return EdgesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    public static List<Node> getNodes(Integer limit, Integer offset) {
        ConstructSparqlQueryProvider provider = new NodesQueryProvider(limit, offset);
        return NodesExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

}
