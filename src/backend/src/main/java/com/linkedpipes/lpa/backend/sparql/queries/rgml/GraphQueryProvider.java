package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.RDF;

public class GraphQueryProvider extends SelectSparqlQueryProvider {

    // VARIABLES
    public static final String VAR_DIRECTED = var("directed");
    public static final String VAR_NODE_COUNT = var("nodeCount");
    public static final String VAR_EDGE_COUNT = var("edgeCount");
    public static final String VAR_GRAPH = var("graph");
    public static final String VAR_NODE = var("node");
    public static final String VAR_EDGE = var("edge");


    @Override
    public SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder
                .addPrefix(Prefixes.RGML_PREFIX, RGML.uri)
                .addPrefix(Prefixes.RDF_PREFIX, RDF.getURI());
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
    public SelectBuilder addWheres(SelectBuilder builder) throws ParseException {
        return builder
                .addWhere(VAR_GRAPH, RDF.type, RGML.Graph)
                .addWhere(VAR_GRAPH, RGML.directed, VAR_DIRECTED)
                .addSubQuery(new SelectBuilder()
                                .addVar("count(*)", VAR_NODE_COUNT)
                                .addWhere(VAR_NODE, RDF.type, SparqlUtils.formatUri(RGML.Node.getURI())))
                .addSubQuery(new SelectBuilder()
                                .addVar("count(*)", VAR_EDGE_COUNT)
                                .addWhere(VAR_EDGE, RDF.type, SparqlUtils.formatUri(RGML.Edge.getURI())));
    }

    @Override
    public SelectBuilder addAdditional(SelectBuilder builder) {
        return builder.setLimit(1);
    }
}
