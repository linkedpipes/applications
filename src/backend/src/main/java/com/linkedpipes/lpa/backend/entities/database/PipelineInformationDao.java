package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.UUID;

@Entity(name="pipelineInformation")
public class PipelineInformationDao implements Serializable {

    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = false, columnDefinition = "uuid")
    private UUID pipelineId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String etlPipelineIri;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String resultGraphIri;

    public void setPipelineId(String id) {
        this.pipelineId = UUID.fromString(id);
    }

    public String getPipelineId() {
        return this.pipelineId.toString();
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
}
