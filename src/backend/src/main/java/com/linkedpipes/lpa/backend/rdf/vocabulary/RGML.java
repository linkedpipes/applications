package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.datatypes.RDFDatatype;
import org.apache.jena.rdf.model.Property;

public class RGML extends Vocabulary {
    public static final String uri = "http://purl.org/puninj/2001/05/rgml-schema#";

    public static final Property directed = model.createProperty(uri, "directed");
    public static final Property source = model.createProperty(uri, "source");
    public static final Property target = model.createProperty(uri, "target");
    public static final Property weight = model.createProperty(uri, "weight");

    public static final RDFDatatype Graph = typeMapper.getSafeTypeByName(uri + "Graph");
    public static final RDFDatatype Node = typeMapper.getSafeTypeByName(uri + "Node");
    public static final RDFDatatype Edge = typeMapper.getSafeTypeByName(uri + "Edge");

}
