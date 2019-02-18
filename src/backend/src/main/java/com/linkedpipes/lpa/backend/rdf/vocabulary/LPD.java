package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class LPD extends Vocabulary {

    public static final String uri = "https://discovery.linkedpipes.com/vocabulary/";

    public static final Resource DataSourceTemplate = createResource(uri, "DataSourceTemplate");
    public static final Resource OutputDataPortTemplate = createResource(uri, "OutputDataPortTemplate");

    public static final Property outputDataSample = createProperty(uri, "outputDataSample");
    public static final Property outputTemplate = createProperty(uri, "outputTemplate");
    public static final Property service = createProperty(uri, "service");
    public static final Property componentConfigurationTemplate = createProperty(uri, "componentConfigurationTemplate");
    public static final Property query = createProperty(uri, "query");
    public static final Property configurationQuery = createProperty(uri, "configurationQuery");

}
