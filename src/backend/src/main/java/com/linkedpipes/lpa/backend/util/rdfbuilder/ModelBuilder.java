package com.linkedpipes.lpa.backend.util.rdfbuilder;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RDFLanguages;

import java.io.ByteArrayInputStream;
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

    private ModelBuilder(URL resource, Lang language) {
        model.read(resource.toString(), language.toString());
    }

    private ModelBuilder(String rdfData, Lang language) {
        RDFDataMgr.read(model, new ByteArrayInputStream(rdfData.getBytes()), language);
        //model.read(new ByteArrayInputStream(rdfData.getBytes()), null, language);
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
     * @param uriToData the url of the resource to initialize the model from
     * @return a builder
     */
    public static ModelBuilder from(URL uriToData) {
        return new ModelBuilder(uriToData);
    }

    /**
     * Initialize from a resource where the RDF data format is known.
     *
     * @param uriToData the url of the resource to initialize the model from
     * @param language the language of the RDF data in the provided resource
     * @return a builder
     */
    public static ModelBuilder from(URL uriToData, Lang language) {
        return new ModelBuilder(uriToData, language);
    }

    /**
     * Initialize from a string containing RDF data.
     *
     * @param rdfData RDF data to initialize the model from
     * @param language the language of the RDF data
     * @return a builder
     */
    public static ModelBuilder fromString(String rdfData, Lang language) {
        return new ModelBuilder(rdfData, language);
    }

    public static ModelBuilder empty() {
        return new ModelBuilder();
    }

}
