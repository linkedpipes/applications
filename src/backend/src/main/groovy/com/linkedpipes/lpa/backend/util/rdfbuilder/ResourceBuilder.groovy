package com.linkedpipes.lpa.backend.util.rdfbuilder

import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.Property
import org.apache.jena.rdf.model.RDFNode
import org.apache.jena.rdf.model.Resource

class ResourceBuilder {

    private final Model model
    private final Resource resource

    ResourceBuilder(Model model) {
        this.model = model
        this.resource = model.createResource()
    }

    ResourceBuilder(Model model, String uri) {
        this.model = model
        this.resource = model.createResource(uri)
    }

    Resource resource(String uri) {
        model.createResource(uri)
    }

    Resource resource(@DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model)
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
        resourceBuilder.resource
    }

    Resource resource(String uri, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model, uri)
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
        resourceBuilder.resource
    }

    void prop(Property p, String o) {
        model.add(resource, p, o)
    }

    void prop(Property p, String o, String l) {
        model.add(resource, p, o, l)
    }

    void prop(Property p, RDFNode o) {
        model.add(resource, p, o)
    }

    void props(Map<Property, Object> properties) {
        properties.each { p, o ->
            if (o instanceof String) {
                model.add(resource, p, o)
            } else if (o instanceof RDFNode) {
                model.add(resource, p, o)
            } else {
                throw new IllegalArgumentException("props")
            }
        }
    }

}