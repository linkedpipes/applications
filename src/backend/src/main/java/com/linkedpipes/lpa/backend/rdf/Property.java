package com.linkedpipes.lpa.backend.rdf;

public class Property {
    public LocalizedValue label;
    public String uri;
    public String schemeUri;

    public Property(LocalizedValue label, String uri, String schemeUri){
        this.label = label;
        this.uri = uri;
        this.schemeUri = schemeUri;
    }
}
