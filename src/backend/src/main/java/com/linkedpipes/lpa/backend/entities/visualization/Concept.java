package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.HashMap;
import java.util.Map;

public class Concept {
    public String uri;
    public LocalizedValue label;
    public LocalizedValue description;
    public String schemeUri;
    public Map<String, String> linkUris;

    public Concept(){
        linkUris = new HashMap<>();
    }

    public Concept(String uriIn, LocalizedValue label, LocalizedValue description, String schemeUri, Map<String, String> linkUris){
        this.uri = uriIn;
        this.label = label;
        this.description = description;
        this.schemeUri = schemeUri;
        this.linkUris = linkUris;
    }
}
