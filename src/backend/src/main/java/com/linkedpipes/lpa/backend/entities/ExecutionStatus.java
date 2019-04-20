package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class ExecutionStatus {

    @JsonProperty("status")
    public EtlStatus status;

    public Date started, finished;

    @JsonProperty("executionStarted")
    public long getStarted() {
        if (started != null) {
            return started.getTime() / 1000L;
        } else {
            return -1;
        }
    }

    @JsonProperty("executionFinished")
    public long getFinished() {
        if (finished != null) {
            return finished.getTime() / 1000L;
        } else {
            return -1;
        }
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
