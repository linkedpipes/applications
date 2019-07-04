package com.linkedpipes.lpa.backend.entities.profile;

import java.util.List;

public class DiscoverySession {
    public String discoveryId, sparqlEndpointIri, dataSampleIri;
    public List<String> namedGraphs;
    public boolean isFinished, isFailed;
    public long started, finished, sessionId;
}
