package com.linkedpipes.lpa.backend.entities.rgml;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class Node {
    public String uri;
    public LocalizedValue label;

    public Node(String uri, LocalizedValue label){
        this.uri = uri;
        this.label = label;
    }
}
