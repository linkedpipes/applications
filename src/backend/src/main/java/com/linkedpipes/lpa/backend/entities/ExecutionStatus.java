package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class ExecutionStatus {

    @JsonProperty("status")
    public EtlStatus status;

    @JsonProperty("executionStarted")
    public long getStarted() {
        return started.getTime() / 1000L;
    }

    public Date started;

    @JsonProperty("executionFinished")
    public long getFinished() {
        return finished.getTime() / 1000L;
    }

    public Date finished;

    @Override
    public String toString() {
        return "ExecutionStatus{" +
                "status=" + status +
                ", started=" + started +
                ", finished=" + finished +
                '}';
    }
}
