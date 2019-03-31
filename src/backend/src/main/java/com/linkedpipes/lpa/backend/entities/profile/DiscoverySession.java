package com.linkedpipes.lpa.backend.entities.profile;
import java.util.Date;
public class DiscoverySession {
    public String id, sparqlEndpointIri, dataSampleIri, namedGraph;
    public boolean finished;
    public long start, stop;
}
