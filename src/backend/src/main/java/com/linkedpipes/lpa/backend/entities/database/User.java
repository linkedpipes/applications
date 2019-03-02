package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;

@Entity(name="lpa_user")
public class User implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = true)
    private String webId;

    @OneToMany(mappedBy="user")
    private List<Discovery> discoveries;

    @OneToMany(mappedBy="user")
    private List<Execution> executions;

    @OneToMany(mappedBy="user")
    private List<Application> applications;

    public void addDiscovery(Discovery discovery) {
        this.discoveries.add(discovery);
        if (discovery.getUser() != this) {
            discovery.setUser(this);
        }
    }

    public List<Discovery> getDiscoveries() {
        return this.discoveries;
    }

    public void addExecution(Execution execution) {
        this.executions.add(execution);
        if (execution.getUser() != this) {
            execution.setUser(this);
        }
    }

    public List<Execution> getExecutions() {
        return this.executions;
    }

    public List<Application> getApplications() {
        return this.applications;
    }

    public void addApplication(Application app) {
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

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String name) {
        this.userName = name;
    }

    public long getId() {
        return id;
    }
}
