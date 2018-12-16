package com.linkedpipes.lpa.backend.sparql.queries.rgml;

import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import org.apache.jena.arq.querybuilder.ConstructBuilder;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

import java.util.Optional;

public class NodesQueryProvider extends ConstructSparqlQueryProvider {
    //TODO combine implementation of NodesByUrisQuery in LDVMi with this class (no need for seperate query provider imo)
    private Optional<Integer> limit;
    private Optional<Integer> offset;

    // PREFIXES
    private static final String RDF_PREFIX = "rdf";
    private static final String RDFS_PREFIX = "rdfs";
    private static final String RGML_PREFIX = "rgml";

    // VARIABLES
    public static final String VAR_NODE = var("node");
    public static final String VAR_LABEL = var("label");

    public NodesQueryProvider(Optional<Integer> limit, Optional<Integer> offset){

        this.limit = limit;
        this.offset = offset;
    }

    @Override
    public ConstructBuilder addPrefixes(ConstructBuilder builder) {
        return builder
                .addPrefix(RGML_PREFIX, RGML.uri)
                .addPrefix(RDF_PREFIX, RDF.getURI())
                .addPrefix(RDFS_PREFIX, RDFS.getURI());
    }

    @Override
    protected ConstructBuilder addConstructs(ConstructBuilder builder) {
        return builder
                .addConstruct(VAR_NODE, RDF.type, RGML.Node)
                .addConstruct(VAR_NODE, RDFS.label, VAR_LABEL);
    }

    @Override
    public ConstructBuilder addWheres(ConstructBuilder builder) {
        return builder
                .addWhere(VAR_NODE, RDF.type, RGML.Node);
        //TODO check if nested select clause is required here (refer to LDVMi implementation)
    }

    @Override
    public ConstructBuilder addOptionals(ConstructBuilder builder) {
        return builder
                .addOptional(VAR_NODE, RDFS.label, VAR_LABEL);
    }

    @Override
    public ConstructBuilder addGroupBy(ConstructBuilder builder) {
        return builder
                .addGroupBy(VAR_NODE)
                .addGroupBy(VAR_LABEL);
    }

    @Override
    public ConstructBuilder addLimit(ConstructBuilder builder) {
        if(this.limit.isPresent())
            builder.setLimit(this.limit.get());

        return builder;
    }

    @Override
    public ConstructBuilder addOffset(ConstructBuilder builder) {
        if(this.offset.isPresent())
            builder.setOffset(this.offset.get());

        return builder;
    }
}
