package com.linkedpipes.lpa.backend.entities;

public class DiscoveryStatusReport {
    public String discoveryId, sparqlEndpointIri, dataSampleIri, namedGraph;
    public DiscoveryStatus status;
    public boolean error, timeout;
    public long finished;
}
