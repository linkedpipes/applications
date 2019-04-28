package com.linkedpipes.lpa.backend.util.rdfbuilder

import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.Property
import org.apache.jena.rdf.model.RDFNode
import org.apache.jena.rdf.model.Resource

class ResourceBuilder {

    final Model model
    final Resource resource

    ResourceBuilder(Model model) {
        this.model = model
        this.resource = model.createResource()
    }

    ResourceBuilder(Model model, String uri) {
        this.model = model
        this.resource = model.createResource(uri)
    }

    ResourceBuilder(Model model, Resource resource) {
        this.model = model
        this.resource = resource
    }

    Resource resource(String uri) {
        model.createResource(uri)
    }

    Resource resource(Map<Property, Object> properties) {
        this.resource {
            props(properties)
        }
    }

    Resource resource(String uri, Map<Property, Object> properties) {
        this.resource(uri) {
            props(properties)
        }
    }

    Resource resource(Resource resource, Map<Property, Object> properties) {
        this.resource(resource) {
            props(properties)
        }
    }

    Resource resource(@DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model)
        delegateTo(resourceBuilder, closure)
        resourceBuilder.resource
    }

    Resource resource(String uri, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model, uri)
        delegateTo(resourceBuilder, closure)
        resourceBuilder.resource
    }

    Resource resource(Resource resource, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model, resource)
        delegateTo(resourceBuilder, closure)
        resourceBuilder.resource
    }

    void prop(Property p, String o) {
        model.add(resource, p, o)
    }

    void prop(Property p, String o, String l) {
        model.add(resource, p, o, l)
    }

    void prop(String p, RDFNode o) {
        prop(model.createProperty(p), o)
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
            } else if (o instanceof Boolean) {
                model.addLiteral(resource, p, o)
            } else if (o instanceof Integer) {
                model.addLiteral(resource, p, o)
            } else {
                throw new IllegalArgumentException("o = " + o + ", type = " + o.getClass().name)
            }
        }
    }

    private static void delegateTo(ResourceBuilder resourceBuilder, Closure closure) {
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
    }

}