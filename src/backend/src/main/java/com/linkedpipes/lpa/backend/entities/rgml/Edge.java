package com.linkedpipes.lpa.backend.entities.rgml;

public class Edge {
    public String uri;
    public String source;
    public String target;
    public Double weight;

    public Edge(String uri, String source, String target, Double weight){
        this.uri = uri;
        this.source = source;
        this.target = target;
        this.weight = weight;
    }
}
