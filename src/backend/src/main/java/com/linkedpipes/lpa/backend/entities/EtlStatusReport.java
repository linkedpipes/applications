package com.linkedpipes.lpa.backend.entities;

public class EtlStatusReport {
    public ExecutionStatus status;
    public boolean error, timeout;
    public String executionIri;
    public PipelineExportResult pipeline;
    public long started, finished;
}
