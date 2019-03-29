package com.linkedpipes.lpa.backend.services

import org.apache.jena.rdf.model.*

class ModelBuilder {

    private final Model model = ModelFactory.createDefaultModel()

    private ModelBuilder() {
    }

    static ModelBuilder create() {
        new ModelBuilder()
    }

    static ModelBuilder create(@DelegatesTo(value = ModelBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        create()(closure)
    }

    ModelBuilder call(@DelegatesTo(value = ModelBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        Closure copy = closure.rehydrate(this, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
        this
    }

    Model build() {
        model
    }

    ModelBuilder prefixes(Map<String, String> prefixes) {
        model.nsPrefixes = prefixes
        this
    }

    ModelBuilder resource(String uri, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(uri)
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
        this
    }

    private class ResourceBuilder {

        private final Resource resource

        ResourceBuilder() {
            this.resource = model.createResource()
        }

        ResourceBuilder(String uri) {
            this.resource = model.createResource(uri)
        }

        Resource resource(String uri) {
            model.createResource(uri)
        }

        Resource resource(@DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
            ResourceBuilder resourceBuilder = new ResourceBuilder()
            Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
            copy.resolveStrategy = Closure.DELEGATE_FIRST
            copy()
            resourceBuilder.resource
        }

        Resource resource(String uri, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
            ResourceBuilder resourceBuilder = new ResourceBuilder(uri)
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

}
