package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Record on published applications and pipeline executions used to create them.
 * Applications are mapped onto user profile.
 */
@Entity(name="application")
public class ApplicationDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String solidIri;

    @ManyToOne
    @JoinColumn(name="execution_id", nullable = true)
    private ExecutionDao execution;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private UserDao user;

    public long getId() {
        return this.id;
    }

    public void setSolidIri(final String solidIri) {
        this.solidIri = solidIri;
    }

    public String getSolidIri() {
        return solidIri;
    }

    public ExecutionDao getExecution() {
        return this.execution;
    }

    public void setExecution(final ExecutionDao execution) {
        this.execution = execution;
    }

    public UserDao getUser() {
        return this.user;
    }

    public void setUser(final UserDao user) {
        this.user = user;
    }
}
