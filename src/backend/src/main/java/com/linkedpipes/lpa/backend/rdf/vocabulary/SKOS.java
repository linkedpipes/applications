package com.linkedpipes.lpa.backend.rdf.vocabulary;

public class SKOS implements Vocabulary {
    private static final String PREFIX = "skos";
    private  static final String PREFIX_URL = "http://www.w3.org/2004/02/skos/core#";

    public String getPrefix(){
        return PREFIX;
    }

    public String getPrefixURL(){
        return PREFIX_URL;
    }
}
