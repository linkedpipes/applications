package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.datatypes.TypeMapper;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

abstract class Vocabulary {

    private static final Model model = ModelFactory.createDefaultModel();

    static Resource createResource(String nameSpace, String localName) {
        return model.createResource(nameSpace + localName);
    }

    static Property createProperty(String nameSpace, String localName) {
        return model.createProperty(nameSpace, localName);
    }

    protected static TypeMapper typeMapper = new TypeMapper();
}
