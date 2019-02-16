package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Resource;

public class LPDSparql extends Vocabulary {

    public static final String uri = "https://discovery.linkedpipes.com/vocabulary/datasource/sparql/";

    public static final Resource SparqlEndpointDataSourceConfiguration = createResource(uri, "SparqlEndpointDataSourceConfiguration");

}
