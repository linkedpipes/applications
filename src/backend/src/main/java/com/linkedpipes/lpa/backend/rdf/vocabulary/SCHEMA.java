package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;

public class SCHEMA extends Vocabulary{
    public static final String uri = "http://schema.org/";

    public static final Property geo = model.createProperty(uri, "geo");
    public static final Property title = model.createProperty(uri, "title");
    public static final Property description = model.createProperty(uri, "description");
    public static final Property name = model.createProperty(uri, "name");
    public static final Property latitude = model.createProperty(uri, "latitude");
    public static final Property longitude = model.createProperty(uri, "longitude");

}
