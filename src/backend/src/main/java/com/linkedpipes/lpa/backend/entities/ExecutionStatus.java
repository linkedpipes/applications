package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class ExecutionStatus {

    @JsonProperty("status")
    public EtlStatus status;

    public Date started, finished;

    @JsonProperty("executionStarted")
    public long getStarted() {
        return started.getTime() / 1000L;
    }

    @JsonProperty("executionFinished")
    public long getFinished() {
        return finished.getTime() / 1000L;
    }

    @Override
    public String toString() {
        return "ExecutionStatus{" +
                "status=" + status +
                ", started=" + started +
                ", finished=" + finished +
                '}';
    }
}
