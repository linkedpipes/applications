package com.linkedpipes.lpa.backend.util.rdfbuilder


import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.ModelFactory
import org.apache.jena.rdf.model.Property
import org.apache.jena.rdf.model.Resource

class ModelBuilder {

    private final Model model

    private ModelBuilder() {
        model = ModelFactory.createDefaultModel()
    }

    private ModelBuilder(InputStream input) {
        model = ModelFactory.createDefaultModel()
                .read(input, "", "TURTLE")
    }

    static ModelBuilder from() {
        new ModelBuilder()
    }

    static ModelBuilder from(@DelegatesTo(value = ModelBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        from()(closure)
    }

    static ModelBuilder from(InputStream input,
                             @DelegatesTo(value = ModelBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ModelBuilder builder = input.withCloseable {
            new ModelBuilder(it)
        }
        builder(closure)
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

    void namespaces(Map<String, String> namespaces) {
        model.nsPrefixes = namespaces
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
        resource(uri) {
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

    private static void delegateTo(ResourceBuilder resourceBuilder, Closure closure) {
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
    }

}
