package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.vocabulary.RDF;

public class GraphQueryProvider extends SelectSparqlQueryProvider {

    // PREFIXES
    private static final String RDF_PREFIX = "rdf";
    private static final String RGML_PREFIX = "rgml";

    // VARIABLES
    public static final String VAR_DIRECTED = var("directed");
    public static final String VAR_NODE_COUNT = var("nodeCount");
    public static final String VAR_EDGE_COUNT = var("edgeCount");
    public static final String VAR_GRAPH = var("graph");
    public static final String VAR_EDGE = var("edge");


    @Override
    public SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder
                .addPrefix(RGML_PREFIX, RGML.uri)
                .addPrefix(RDF_PREFIX, RDF.getURI());
    }

    @Override
    public SelectBuilder addVars(SelectBuilder builder) {
        return builder
                .setDistinct(true)
                .addVar(VAR_DIRECTED)
                .addVar(VAR_NODE_COUNT)
                .addVar(VAR_EDGE_COUNT);
    }

    @Override
    public SelectBuilder addWheres(SelectBuilder builder) {
        return builder
                .addWhere(VAR_GRAPH, RDF.type, RGML.Graph)
                .addWhere(VAR_GRAPH, RGML.directed, VAR_DIRECTED);
        //TODO add nested select clause in WHERE
    }

    @Override
    public SelectBuilder addAdditional(SelectBuilder builder) {
        return builder.setLimit(1);
    }
}
