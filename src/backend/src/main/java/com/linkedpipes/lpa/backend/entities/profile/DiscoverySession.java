package com.linkedpipes.lpa.backend.entities.profile;

import java.util.List;

public class DiscoverySession {
    public String discoveryId, sparqlEndpointIri, dataSampleIri;
    public List<String> namedGraphs;
    public boolean isFinished;
    public long started, finished;
}
