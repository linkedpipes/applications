package com.linkedpipes.lpa.backend.util.rdfbuilder


import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.ModelFactory
import org.apache.jena.rdf.model.Property

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

    ModelBuilder namespaces(Map<String, String> namespaces) {
        model.nsPrefixes = namespaces
        this
    }

    ModelBuilder resource(String uri, Map<Property, Object> properties) {
        resource(uri) {
            props(properties)
        }
    }

    ModelBuilder resource(String uri, @DelegatesTo(value = ResourceBuilder, strategy = Closure.DELEGATE_FIRST) Closure closure) {
        ResourceBuilder resourceBuilder = new ResourceBuilder(model, uri)
        Closure copy = closure.rehydrate(resourceBuilder, closure.owner, closure.thisObject)
        copy.resolveStrategy = Closure.DELEGATE_FIRST
        copy()
        this
    }

}
