package com.linkedpipes.lpa.backend.entities;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class ExecutionStatus {
    @SerializedName("status")
    public EtlStatus status;

    @SerializedName("executionStarted")
    public Date started;

    @SerializedName("executionFinished")
    public Date finished;
}
