package com.linkedpipes.lpa.backend.util.rdfbuilder;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * A helper class for the {@link ModelBuilder}.
 *
 * {@code property(...)} methods return {@code this}. {@code resource(...)} methods return a builder for the object of
 * the added triple.
 */
public class ResourceBuilder {

    private final Resource resource;
    private final Model model;

    private ResourceBuilder(Resource resource, Model model) {
        this.resource = resource;
        this.model = model;
    }

    /**
     * Add a triple {@code (this, property, resource)}. Return {@code this}.
     *
     * @param property the property of the triple added
     * @param resource the resource of the triple added
     * @return this
     */
    public ResourceBuilder property(String property, Resource resource) {
        return property(ResourceFactory.createProperty(property), resource);
    }

    /**
     * Add a triple {@code (this, property, resource)}. Return {@code this}.
     *
     * @param property the property of the triple added
     * @param resource the resource of the triple added
     * @return this
     */
    public ResourceBuilder property(Property property, Resource resource) {
        model.add(this.resource, property, resource);
        return this;
    }

    /**
     * Add a triple {@code (this, property, object)}. Return {@code this}.
     *
     * @param property the property of the triple added
     * @param object   the object of the triple added
     * @return this
     */
    public ResourceBuilder property(Property property, String object) {
        model.add(this.resource, property, object);
        return this;
    }

    /**
     * Add a triple {@code (this, property, object)}, with object being in language {@code lang}. Return {@code this}.
     *
     * @param property the property of the triple added
     * @param object the object of the triple added
     * @param lang the language of {@code object}
     * @return this
     */
    public ResourceBuilder property(Property property, String object, String lang) {
        model.add(this.resource, property, object, lang);
        return this;
    }

    /**
     * Add a triple {@code (this, property, resource)}. Return builder for {@code resource}.
     *
     * @param property the property of the triple added
     * @param resource the resource of the triple added
     * @return a builder for {@code resource}
     */
    public ResourceBuilder resource(Property property, Resource resource) {
        property(property, resource);
        return ResourceBuilder.of(resource, model);
    }

    /**
     * Add a triple {@code (this, property, &lt;blank node&gt;)}. Return builder for the blank node.
     *
     * @param property the property of the triple added
     * @return a builder for the blank node created
     */
    public ResourceBuilder resource(Property property) {
        return resource(property, ResourceFactory.createResource());
    }

    static ResourceBuilder of(Resource resource, Model model) {
        return new ResourceBuilder(resource, model);
    }

}
