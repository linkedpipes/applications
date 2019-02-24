package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;

public class Schema extends Vocabulary {

    public static final String uri = "http://schema.org/";

    public static final Property geo = createProperty(uri, "geo");
    public static final Property title = createProperty(uri, "title");
    public static final Property description = createProperty(uri, "description");
    public static final Property name = createProperty(uri, "name");
    public static final Property latitude = createProperty(uri, "latitude");
    public static final Property longitude = createProperty(uri, "longitude");

}
