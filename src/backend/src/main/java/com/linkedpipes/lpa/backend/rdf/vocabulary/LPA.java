package com.linkedpipes.lpa.backend.rdf.vocabulary;

import org.apache.jena.rdf.model.Resource;

public class LPA extends Vocabulary {

    public static final String uri = "https://applications.linkedpipes.com/";

    public static class Dataset extends Vocabulary {

        public static final String uri = LPA.uri + "dataset/";

        public static final Resource template = createResource(uri, "template");
        public static final Resource output = createResource(uri, "output");
        public static final Resource defaultConfiguration = createResource(uri, "defaultConfiguration");
        public static final Resource defaultService = createResource(uri, "defaultService");

    }

    public static class Generated extends Vocabulary {

        public static final String uri = LPA.uri + "generated-data/";

        public static final Resource graph = createResource(uri, "graph");
    }

}
