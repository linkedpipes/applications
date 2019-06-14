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
        RDFDataMgr.read(model, resource.toString()) ;
    }

    private ModelBuilder(URL resource, String language) {
        model.read(resource.toString(), language);
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
     * Initialize from a resource.
     *
     * @param model the url of the resource to initialize the model from
     * @return a builder
     */
    public static ModelBuilder from(URL model) {
        return new ModelBuilder(model);
    }

    /**
     * Initialize from a resource where the RDF data format is known.
     *
     * @param model the url of the resource to initialize the model from
     * @param language the language of the RDF data in the provided resource
     * @return a builder
     */
    public static ModelBuilder from(URL model, String language) {
        return new ModelBuilder(model, language);
    }

    public static ModelBuilder empty() {
        return new ModelBuilder();
    }

}
