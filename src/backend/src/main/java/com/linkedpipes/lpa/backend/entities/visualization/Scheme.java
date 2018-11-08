package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class Scheme {
    public String uri;
    public LocalizedValue label;
    public LocalizedValue description;

    public Scheme(String uri, LocalizedValue label, LocalizedValue description){
        this.uri = uri;
        this.label = label;
        this.description = description;
    }
}
