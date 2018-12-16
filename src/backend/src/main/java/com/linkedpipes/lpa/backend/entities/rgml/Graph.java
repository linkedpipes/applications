package com.linkedpipes.lpa.backend.entities.rgml;

public class Graph {
    public Boolean directed;
    public int nodeCount;
    public int edgeCount;

    public Graph(Boolean directed, int nodeCount, int edgeCount){
        this.directed = directed;
        this.nodeCount = nodeCount;
        this.edgeCount = edgeCount;
    }
}
