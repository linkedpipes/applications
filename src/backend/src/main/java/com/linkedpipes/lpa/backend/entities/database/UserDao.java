package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity(name="lpa_user")
public class UserDao implements Serializable {

    private static final String DEFAULT_COLOR = "BLACK";

    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String webId;

    @Column(nullable = true)
    private String color = DEFAULT_COLOR;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<DiscoveryDao> discoveries;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ExecutionDao> executions;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ApplicationDao> applications;

    public void addDiscovery(final DiscoveryDao discovery) {
        this.discoveries.add(discovery);
        if (discovery.getUser() != this) {
            discovery.setUser(this);
        }
    }

    public List<DiscoveryDao> getDiscoveries() {
        return this.discoveries;
    }

    public void addExecution(final ExecutionDao execution) {
        this.executions.add(execution);
        if (execution.getUser() != this) {
            execution.setUser(this);
        }
    }

    public List<ExecutionDao> getExecutions() {
        return this.executions;
    }

    public List<ApplicationDao> getApplications() {
        return this.applications;
    }

    public void addApplication(final ApplicationDao app) {
        this.applications.add(app);
        if (app.getUser() != this) {
            app.setUser(this);
        }
    }

    public String getWebId() {
        return this.webId;
    }

    public void setWebId(final String webId) {
        this.webId = webId;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(final String color) {
        this.color = color;
    }
}
