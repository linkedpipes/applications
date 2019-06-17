package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;

public class Time extends Vocabulary {
    public static final String uri = "http://www.w3.org/2006/time#";

    public static final Property hasBeginning = createProperty(uri, "hasBeginning");
    public static final Property hasEnd = createProperty(uri, "hasEnd");
    public static final Property inDateTime = createProperty(uri, "inDateTime");
}
