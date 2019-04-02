package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import com.linkedpipes.lpa.backend.entities.EtlStatus;

@Entity(name="execution")
public class ExecutionDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String executionIri;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private EtlStatus status;

    @Column(nullable = false)
    private String selectedVisualiser;

    @Column(nullable = false)
    private Date started;

    @Column(nullable = true)
    private Date finished;

    @ManyToOne
    private UserDao user;

    @ManyToOne
    private PipelineInformationDao pipeline;

    public UserDao getUser() {
        return user;
    }

    public void setUser(UserDao user) {
        this.user = user;

        if (!user.getExecutions().contains(this)) {
            user.getExecutions().add(this);
        }
    }

    public void setPipeline(PipelineInformationDao pipeline) {
        this.pipeline = pipeline;

        if (!pipeline.getExecutions().contains(this)) {
            pipeline.getExecutions().add(this);
        }
    }

    public PipelineInformationDao getPipeline() {
        return this.pipeline;
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

    public void setStarted(Date started) {
        this.started = started;
    }

    public Date getStarted() {
        return this.started;
    }

    public void setFinished(Date finished) {
        this.finished = finished;
    }

    public Date getFinished() {
        return this.finished;
    }
}
