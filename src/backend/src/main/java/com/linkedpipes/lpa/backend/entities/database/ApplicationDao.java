package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;

@Entity(name="application")
public class ApplicationDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false)
    private String solidIri;

    @ManyToOne
    private UserDao user;

    public UserDao getUser() {
        return user;
    }

    public void setUser(UserDao user) {
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

    public long getId() {
        return this.id;
    }
}
