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
    private String solidIri;

    @ManyToOne
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;

        if (!user.getApplications().contains(this)) {
            user.getApplications().add(this);
        }
    }

    public void setSolidIri(String iri) {
        this.solidIri = iri;
    }

    public String getSolidIri() {
        return this.solidIri;
    }
}
