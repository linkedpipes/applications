package com.linkedpipes.lpa.backend.util.rdfbuilder;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;

import java.io.StringWriter;
import java.net.URL;

/**
 * Convenient wrapper for the general use case of the {@link Model} interface.
 */
public class ModelBuilder {

    private final Model model = ModelFactory.createDefaultModel();

    private ModelBuilder() {
    }

    private ModelBuilder(URL resource) {
        model.read(resource.toString(), "TTL");
    }

    public ModelBuilder namespace(String prefix, String uri) {
        model.setNsPrefix(prefix, uri);
        return this;
    }

    public ResourceBuilder resource(String uri) {
        return resource(ResourceFactory.createResource(uri));
    }

    public ResourceBuilder resource(Resource resource) {
        return ResourceBuilder.of(resource, model);
    }

    public Model build() {
        return model;
    }

    /**
     * @return TTL-formatted representation of the underlying RDF model
     */
    @Override
    public String toString() {
        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        return stringWriter.toString();
    }

    /**
     * Initialize from a TTL-formatted resource.
     *
     * @param model the resource to initialize the model from
     * @return a builder
     */
    public static ModelBuilder from(URL model) {
        return new ModelBuilder(model);
    }

    public static ModelBuilder empty() {
        return new ModelBuilder();
    }

}
