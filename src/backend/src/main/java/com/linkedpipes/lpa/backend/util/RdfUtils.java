package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.util.rdfbuilder.ModelBuilder;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFLanguages;

public final class RdfUtils {

    public static String RdfDataToTurtleFormat(String rdfData, Lang rdfLanguage){
        if (rdfLanguage != RDFLanguages.TTL) {
            //read rdf data into model to transform it to ttl
            ModelBuilder mb = ModelBuilder.fromString(rdfData, rdfLanguage);
            return mb.toString();
        }

        return rdfData;
    }
}
