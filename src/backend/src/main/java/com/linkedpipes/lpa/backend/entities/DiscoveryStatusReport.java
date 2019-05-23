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

    @NotNull
    public static DiscoveryStatusReport createStandardReport(
            @NotNull String discoveryId,
            @NotNull DiscoveryStatus discoveryStatus,
            @NotNull Date finished,
            @Nullable DiscoveryDao dao) {
        DiscoveryStatusReport report = new DiscoveryStatusReport();

        report.discoveryId = discoveryId;
        report.status = discoveryStatus;
        report.error = false;
        report.timeout = false;
        report.finished = finished.getTime() / 1000L;

        if (dao != null) {
            report.sparqlEndpointIri = dao.getSparqlEndpointIri();
            report.dataSampleIri = dao.getDataSampleIri();
            report.namedGraphs = new ArrayList<>();
            for (DiscoveryNamedGraphDao ng : dao.getNamedGraphs()) {
                report.namedGraphs.add(ng.getNamedGraph());
            }
        } else {
            report.sparqlEndpointIri = null;
            report.dataSampleIri = null;
            report.namedGraphs = null;
        }

        return report;
    }

    @NotNull
    public static DiscoveryStatusReport createErrorReport(
            @NotNull String discoveryId,
            @NotNull boolean timeout,
            @Nullable DiscoveryDao dao) {
        DiscoveryStatusReport report = new DiscoveryStatusReport();
        report.discoveryId = discoveryId;
        report.status = null;
        report.error = false;
        report.timeout = timeout;
        if (dao != null) {
            report.sparqlEndpointIri = dao.getSparqlEndpointIri();
            report.dataSampleIri = dao.getDataSampleIri();
            report.namedGraphs = new ArrayList<>();
            for (DiscoveryNamedGraphDao ng : dao.getNamedGraphs()) {
                report.namedGraphs.add(ng.getNamedGraph());
            }
        } else {
            report.sparqlEndpointIri = null;
            report.dataSampleIri = null;
            report.namedGraphs = null;
        }
        return report;
    }
}
