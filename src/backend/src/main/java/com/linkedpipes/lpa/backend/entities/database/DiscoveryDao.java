package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;

@Entity(name="discovery")
public class DiscoveryDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false)
    private String discoveryId;

    @Column(nullable = false)
    private Date started;

    @Column(nullable = true)
    private Date finished;

    @Column(nullable = false)
    private boolean executing;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String sparqlEndpointIri;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String dataSampleIri;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String namedGraph;

    @ManyToOne
    private UserDao user;

    public UserDao getUser() {
        return user;
    }

    public void setUser(UserDao user) {
        this.user = user;

        if (!user.getDiscoveries().contains(this)) {
            user.getDiscoveries().add(this);
        }
    }

    public void setDiscoveryStarted(String discoveryId, Date started) {
        this.discoveryId = discoveryId;
        this.started = started;
        this.executing = true;
    }

    public String getDiscoveryId() {
        return discoveryId;
    }

    public Date getStarted() {
        return started;
    }

    public Date getFinished() {
        return finished;
    }

    public long getId() {
        return id;
    }

    public boolean getExecuting() {
        return this.executing;
    }

    public void setExecuting(boolean executing) {
        this.executing = executing;
    }

    public void setFinished(Date finished) {
        this.finished = finished;
    }

    public void setSparqlEndpointIri(String sparqlEndpointIri) {
        this.sparqlEndpointIri = sparqlEndpointIri;
    }

    public String getSparqlEndpointIri() {
        return this.sparqlEndpointIri;
    }

    public void setDataSampleIri(String dataSampleIri) {
        this.dataSampleIri = dataSampleIri;
    }

    public String getDataSampleIri() {
        return this.dataSampleIri;
    }

    public void setNamedGraph(String namedGraph) {
        this.namedGraph = namedGraph;
    }

    public String getNamedGraph() {
        return this.namedGraph;
    }
}
