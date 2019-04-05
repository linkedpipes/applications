package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity(name="pipelineInformation")
public class PipelineInformationDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String pipelineId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String etlPipelineIri;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String resultGraphIri;

    @OneToMany(mappedBy="pipeline")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<ExecutionDao> executions;

    public void setPipelineId(String id) {
        this.pipelineId = id;
    }

    public String getPipelineId() {
        return this.pipelineId;
    }

    public void setEtlPipelineIri(String iri) {
        this.etlPipelineIri = iri;
    }

    public String getEtlPipelineIri() {
        return this.etlPipelineIri;
    }

    public void setResultGraphIri(String iri) {
        this.resultGraphIri = iri;
    }

    public String getResultGraphIri() {
        return this.resultGraphIri;
    }

    public long getId() {
        return this.id;
    }

    public void addExecution(ExecutionDao execution) {
        this.executions.add(execution);
        if (execution.getPipeline() != this) {
            execution.setPipeline(this);
        }
    }

    public List<ExecutionDao> getExecutions() {
        return this.executions;
    }
}
