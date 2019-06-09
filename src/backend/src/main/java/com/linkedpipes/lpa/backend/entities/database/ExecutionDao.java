package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
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

    @Column(nullable = false)
    private boolean removed = false;

    @Column(nullable = false, name="repeat")
    private boolean scheduled = false;

    @Column(nullable = false, name="native")
    private boolean startedByUser = true;

    @Column(nullable = false)
    private long frequencyHours = -1;

    @ManyToOne
    @JoinColumn(name="user_web_id")
    private UserDao user;

    @ManyToOne
    @JoinColumn(name="pipeline_id", nullable=true)
    private PipelineInformationDao pipeline;

    @OneToMany(mappedBy="execution")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ApplicationDao> applications;

    public List<ApplicationDao> getApplications() {
        return this.applications;
    }

    public void addApplication(final ApplicationDao app) {
        this.applications.add(app);

        if (this != app.getExecution()) {
            app.setExecution(this);
        }
    }

    public void removeApplication(final ApplicationDao app) {
        this.applications.remove(app);

        if (this == app.getExecution()) {
            app.setExecution(null);
        }
    }

    public UserDao getUser() {
        return user;
    }

    public void setUser(UserDao user) {
        this.user = user;

        if ((user != null) && !user.getExecutions().contains(this)) {
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

    public long getPipelineId() {
        return this.pipeline.getId();
    }

    public boolean isRemoved() {
        return this.removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }

    public boolean isScheduled() {
        return this.scheduled;
    }

    public void setScheduled(boolean scheduled) {
        this.scheduled = scheduled;
    }

    public long getFrequencyHours() {
        return this.frequencyHours;
    }

    public void setFrequencyHours(long freq) {
        this.frequencyHours = freq;
    }

    public boolean isStartedByUser() {
        return this.startedByUser;
    }

    public void setStartedByUser(boolean user) {
        this.startedByUser = user;
    }
}
