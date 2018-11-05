package com.linkedpipes.lpa.backend.entities.visualization;

import java.util.HashMap;
import java.util.Map;

public class Concept {
    public String uri;
    public String label;
    public String description;
    public String schemeUri;
    public Map<String, String> linkUris;

    public Concept(){
        linkUris = new HashMap<>();
    }

    public Concept(String uriIn, String label, String description, String schemeUri, Map<String, String> linkUris){
        this.uri = uriIn;
        this.description = description;
        this.schemeUri = schemeUri;
        this.linkUris = linkUris;
    }
}
