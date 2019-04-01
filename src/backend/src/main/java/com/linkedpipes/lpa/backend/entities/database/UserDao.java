package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity(name="lpa_user")
public class UserDao implements Serializable {

    @Id
    @Column(nullable = false, columnDefinition = "TEXT")
    private String webId;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<DiscoveryDao> discoveries;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ExecutionDao> executions;

    @OneToMany(mappedBy="user")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ApplicationDao> applications;

    public void addDiscovery(DiscoveryDao discovery) {
        this.discoveries.add(discovery);
        if (discovery.getUser() != this) {
            discovery.setUser(this);
        }
    }

    public List<DiscoveryDao> getDiscoveries() {
        return this.discoveries;
    }

    public void addExecution(ExecutionDao execution) {
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

    public void addApplication(ApplicationDao app) {
        this.applications.add(app);
        if (app.getUser() != this) {
            app.setUser(this);
        }
    }

    public String getWebId() {
        return this.webId;
    }

    public void setWebId(String webId) {
        this.webId = webId;
    }

}
