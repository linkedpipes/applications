package com.linkedpipes.lpa.backend.util.rdfbuilder;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;

public class ResourceBuilder {

    private final Resource resource;
    private final Model model;

    private ResourceBuilder(Resource resource, Model model) {
        this.resource = resource;
        this.model = model;
    }

    public ResourceBuilder property(String property, Resource resource) {
        return property(ResourceFactory.createProperty(property), resource);
    }

    public ResourceBuilder property(Property property, Resource resource) {
        model.add(this.resource, property, resource);
        return this;
    }

    public ResourceBuilder property(Property property, String object) {
        model.add(this.resource, property, object);
        return this;
    }

    public ResourceBuilder property(Property property, String object, String lang) {
        model.add(this.resource, property, object, lang);
        return this;
    }

    public ResourceBuilder resource(Property property, Resource resource) {
        property(property, resource);
        return ResourceBuilder.of(resource, model);
    }

    public ResourceBuilder resource(Property property) {
        return resource(property, ResourceFactory.createResource());
    }

    public static ResourceBuilder of(Resource resource, Model model) {
        return new ResourceBuilder(resource, model);
    }

}
