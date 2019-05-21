package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

//Combines implementation of NodesQuery and NodesByUrisQuery in LDVMi
public class NodesQueryProvider extends ConstructSparqlQueryProvider {
    private Integer limit;
    private Integer offset;
    private List<String> nodeUris;

    // VARIABLES
    public static final String VAR_NODE = var("node");
    public static final String VAR_LABEL = var("label");

    public NodesQueryProvider(){
        this.limit = null;
        this.offset = null;
        this.nodeUris = new ArrayList<>();
    }

    public NodesQueryProvider(Integer limit, Integer offset){
        this.limit = limit;
        this.offset = offset;
    }

    public NodesQueryProvider(List<String> nodeUris){
        this.limit = null;
        this.offset = null;
        this.nodeUris = nodeUris;
    }

    @NotNull
    @Override
    public ConstructBuilder addPrefixes(@NotNull ConstructBuilder builder) {
        return builder
                .addPrefix(Prefixes.RGML_PREFIX, RGML.uri)
                .addPrefix(Prefixes.RDF_PREFIX, RDF.getURI())
                .addPrefix(Prefixes.RDFS_PREFIX, RDFS.getURI());
    }

    @NotNull
    @Override
    protected ConstructBuilder addConstructs(@NotNull ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_NODE, RDF.type, SparqlUtils.formatUri(RGML.Node.getURI()))
                .addConstruct(VAR_NODE, RDFS.label, VAR_LABEL);
    }

    @NotNull
    @Override
    public ConstructBuilder addWheres(@NotNull ConstructBuilder builder) {
        builder
                .addWhere(VAR_NODE, RDF.type, SparqlUtils.formatUri(RGML.Node.getURI()));

        if(nodeUris != null && !nodeUris.isEmpty()) {
            builder.addWhereValueVar(VAR_NODE, nodeUris.stream().map(uri -> SparqlUtils.formatUri(uri)).toArray());
        }

        return builder;
        //TODO check if nested select clause is required here (refer to LDVMi implementation)
    }

    @NotNull
    @Override
    public ConstructBuilder addOptionals(@NotNull ConstructBuilder builder) {
        return builder
                .addOptional(VAR_NODE, RDFS.label, VAR_LABEL);
    }

    @NotNull
    @Override
    public ConstructBuilder addGroupBy(@NotNull ConstructBuilder builder) {
        return builder
                .addGroupBy(VAR_NODE)
                .addGroupBy(VAR_LABEL);
    }

    @NotNull
    @Override
    public ConstructBuilder addLimit(@NotNull ConstructBuilder builder) {
        if(this.limit != null && this.limit > 0)
            builder.setLimit(this.limit);

        return builder;
    }

    @NotNull
    @Override
    public ConstructBuilder addOffset(@NotNull ConstructBuilder builder) {
        if(this.offset != null && this.offset > 0)
            builder.setOffset(this.offset);

        return builder;
    }
}
