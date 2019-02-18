package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class SD extends Vocabulary {

    public static final String uri = "http://www.w3.org/ns/sparql-service-description#";

    public static final Resource Service = createResource(uri, "Service");

    public static final Property endpoint = createProperty(uri, "endpoint");
    public static final Property name = createProperty(uri, "name");
    public static final Property namedGraph = createProperty(uri, "namedGraph");

}
