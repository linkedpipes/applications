package com.linkedpipes.lpa.backend.entities;

import com.linkedpipes.lpa.backend.entities.database.DiscoveryDao;
import com.linkedpipes.lpa.backend.entities.database.DiscoveryNamedGraphDao;

import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class DiscoveryStatusReport {
    public String discoveryId, sparqlEndpointIri, dataSampleIri;
    public List<String> namedGraphs;
    public DiscoveryStatus status;
    public boolean error, timeout;
    public long finished;

    private DiscoveryStatusReport(
            @NotNull String discoveryId,
            @NotNull DiscoveryStatus discoveryStatus,
            @NotNull boolean error,
            @NotNull boolean timeout,
            @Nullable DiscoveryDao dao) {
        this.discoveryId = discoveryId;
        this.status = discoveryStatus;
        this.error = error;
        this.timeout = timeout;
        this.finished = -1;

        if (dao != null) {
            this.sparqlEndpointIri = dao.getSparqlEndpointIri();
            this.dataSampleIri = dao.getDataSampleIri();
            this.namedGraphs = new ArrayList<>();
            for (DiscoveryNamedGraphDao ng : dao.getNamedGraphs()) {
                this.namedGraphs.add(ng.getNamedGraph());
            }
        } else {
            this.sparqlEndpointIri = null;
            this.dataSampleIri = null;
            this.namedGraphs = null;
        }
    }

    @NotNull
    public static DiscoveryStatusReport createStandardReport(
            @NotNull String discoveryId,
            @NotNull DiscoveryStatus discoveryStatus,
            @NotNull Date finished,
            @Nullable DiscoveryDao dao) {
        DiscoveryStatusReport report = new DiscoveryStatusReport(discoveryId, discoveryStatus, false, false, dao);
        report.finished = finished.getTime() / 1000L;
        return report;
    }

    @NotNull
    public static DiscoveryStatusReport createErrorReport(
            @NotNull String discoveryId,
            @NotNull boolean timeout,
            @Nullable DiscoveryDao dao) {
        DiscoveryStatusReport report = new DiscoveryStatusReport(discoveryId, null, true, timeout, dao);
        return report;
    }
}
