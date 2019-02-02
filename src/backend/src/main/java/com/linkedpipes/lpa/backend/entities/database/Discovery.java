package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;

@Entity(name="discovery")
public class Discovery implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String discoveryId;

    @ManyToOne
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;

        if (!user.getDiscoveries().contains(this)) {
            user.getDiscoveries().add(this);
        }
    }

    public void setDiscoveryStarted(String discoveryId, Date started) {
        this.discoveryId = discoveryId;
        this.started = started;
    }

    public String getDiscoveryId() {
        return discoveryId;
    }

    public long getId() {
        return id;
    }
}
