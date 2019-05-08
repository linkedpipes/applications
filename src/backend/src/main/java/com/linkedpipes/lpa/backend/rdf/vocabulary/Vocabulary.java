package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;

abstract class Vocabulary {

    static Resource createResource(String nameSpace, String localName) {
        return ResourceFactory.createResource(nameSpace + localName);
    }

    static Property createProperty(String nameSpace, String localName) {
        return ResourceFactory.createProperty(nameSpace, localName);
    }

}
