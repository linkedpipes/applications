package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import com.linkedpipes.lpa.backend.entities.EtlStatus;

@Entity(name="execution")
public class Execution implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false)
    private String executionIri;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EtlStatus status;

    @Column(nullable = false)
    private String selectedVisualiser;

    @ManyToOne
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;

        if (!user.getExecutions().contains(this)) {
            user.getExecutions().add(this);
        }
    }

    public void setExecutionStarted(String executionIri) {
        this.executionIri = executionIri;
    }

    public String getExecutionIri() {
        return executionIri;
    }

    public long getId() {
        return id;
    }

    public void setStatus(EtlStatus status) {
        this.status = status;
    }

    public EtlStatus getStatus() {
        return this.status;
    }

    public void setSelectedVisualiser(String visualizer) {
        this.selectedVisualiser = visualizer;
    }

    public String getSelectedVisualiser() {
        return this.selectedVisualiser;
    }
}
