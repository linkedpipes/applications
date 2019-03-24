package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class RGML extends Vocabulary {
    public static final String uri = "http://purl.org/puninj/2001/05/rgml-schema#";

    public static final Resource Graph = createResource(uri, "Graph");
    public static final Resource Node = createResource(uri, "Node");
    public static final Resource Edge = createResource(uri, "Edge");

    public static final Property directed = createProperty(uri, "directed");
    public static final Property source = createProperty(uri, "source");
    public static final Property target = createProperty(uri, "target");
    public static final Property weight = createProperty(uri, "weight");

}
