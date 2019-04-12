package com.linkedpipes.lpa.backend.entities.profile;
public class DiscoverySession {
    public String discoveryId, sparqlEndpointIri, dataSampleIri, namedGraph;
    public boolean isFinished;
    public long started, finished;
}
