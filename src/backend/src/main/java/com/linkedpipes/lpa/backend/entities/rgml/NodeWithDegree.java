package com.linkedpipes.lpa.backend.entities.rgml;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class NodeWithDegree extends Node {
    public int inDegree;
    public int outDegree;

    public NodeWithDegree(String uri, LocalizedValue label, int inDegree, int outDegree){
        super(uri, label);
        this.inDegree = inDegree;
        this.outDegree = outDegree;
    }
}
