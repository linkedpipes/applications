package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.enums.EdgeDirection;
import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

public class IncidentEdgesQueryProvider extends ConstructSparqlQueryProvider {
    private String nodeUri;
    private EdgeDirection direction;

    // VARIABLES
    public static final String VAR_EDGE = var("edge");
    public static final String VAR_SOURCE = var("source");
    public static final String VAR_TARGET = var("target");
    public static final String VAR_WEIGHT = var("weight");

    public IncidentEdgesQueryProvider(String nodeUri, EdgeDirection direction){
        this.nodeUri = nodeUri;
        this.direction = direction;
    }

    @Override
    public ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.RGML_PREFIX, RGML.uri)
                .addPrefix(Prefixes.RDF_PREFIX, RDF.getURI())
                .addPrefix(Prefixes.RDFS_PREFIX, RDFS.getURI());
    }

    @Override
    protected ConstructBuilder addConstructs(ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_EDGE, RDF.type, SparqlUtils.formatUri(RGML.Edge.getURI()))
                .addConstruct(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addConstruct(VAR_EDGE, RGML.target, VAR_TARGET)
                .addConstruct(VAR_EDGE, RGML.weight, VAR_WEIGHT);
    }

    @Override
    public ConstructBuilder addWheres(ConstructBuilder builder) {
        SelectBuilder subquery = new SelectBuilder()
                .addVar(VAR_EDGE)
                .addVar(VAR_SOURCE)
                .addVar(VAR_TARGET)
                .addVar(VAR_WEIGHT)
                .addWhere(VAR_EDGE, RDF.type, SparqlUtils.formatUri(RGML.Node.getURI()))
                .addWhere(VAR_EDGE, RGML.source, VAR_SOURCE)
                .addWhere(VAR_EDGE, RGML.target, VAR_TARGET)
                .addWhere(VAR_EDGE, RGML.weight, VAR_WEIGHT);

        switch(direction){
            case INCOMING: subquery.addWhere(VAR_EDGE, RGML.target, nodeUri);
            case OUTGOING: subquery.addWhere(VAR_EDGE, RGML.source, nodeUri);
        }

        return builder.addSubQuery(subquery);
    }
}
