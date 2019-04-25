package com.linkedpipes.lpa.backend.entities;

import java.util.List;

public class DiscoveryStatusReport {
    public String discoveryId, sparqlEndpointIri, dataSampleIri;
    public List<String> namedGraphs;
    public DiscoveryStatus status;
    public boolean error, timeout;
    public long finished;
}
