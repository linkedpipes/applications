package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Resource;

public class LPDConf extends Vocabulary {

    public static final String uri = "https://discovery.linkedpipes.com/vocabulary/dataset/dblp/configuration/";

    public static final Resource Configuration = createResource(uri, "Configuration");

}
