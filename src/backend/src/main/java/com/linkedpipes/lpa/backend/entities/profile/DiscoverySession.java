package com.linkedpipes.lpa.backend.entities.profile;

import java.util.List;

public class DiscoverySession {
    public String discoveryId, sparqlEndpointIri, dataSampleIri;
    public List<String> namedGraphs;
    public boolean isFinished, isFailed;
    public long started, finished, sessionId;

    public static DiscoverySession create(long sessionId, String discoveryId) {
        DiscoverySession session = new DiscoverySession();
        initBasics(session);
        session.isFinished = false;
        session.isFailed = false;
        session.sessionId = sessionId;
        session.discoveryId = discoveryId;
        return session;
    }

    public static DiscoverySession createError(long sessionId) {
        DiscoverySession session = new DiscoverySession();
        initBasics(session);
        session.sessionId = sessionId;
        session.isFailed = true;
        session.discoveryId = null;
        session.isFinished = true;
        return session;
    }

    private static void initBasics(DiscoverySession session) {
        session.started = -1;
        session.finished = -1;
        session.sparqlEndpointIri = null;
        session.dataSampleIri = null;
        session.namedGraphs = null;
    }
}
