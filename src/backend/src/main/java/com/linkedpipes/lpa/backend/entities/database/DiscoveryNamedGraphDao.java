package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name="discovery_named_graph")
public class DiscoveryNamedGraphDao implements Serializable {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    private DiscoveryDao discovery;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String namedGraph;

    public String getNamedGraph() {
        return namedGraph;
    }

    public void setNamedGraph(String named) {
        this.namedGraph = named;
    }

    public DiscoveryDao getDiscovery() {
        return discovery;
    }

    public void setDiscovery(DiscoveryDao d) {
        this.discovery = d;

        if (!d.getNamedGraphs().contains(this)) {
            d.addNamedGraph(this);
        }
    }
}
