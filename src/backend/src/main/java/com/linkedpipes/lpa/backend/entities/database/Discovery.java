package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;

@Entity(name="discovery")
public class Discovery implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false)
    private String discoveryId;

    @Column(nullable = false)
    private Date started;

    @Column(nullable = false)
    private boolean executing;

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
        this.executing = true;
    }

    public String getDiscoveryId() {
        return discoveryId;
    }

    public Date getDateStarted() {
        return started;
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
}
