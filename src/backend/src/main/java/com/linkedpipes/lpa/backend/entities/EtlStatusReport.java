package com.linkedpipes.lpa.backend.entities;

import com.linkedpipes.lpa.backend.entities.database.PipelineInformationDao;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class EtlStatusReport {
    public ExecutionStatus status;
    public boolean error, timeout;
    public String executionIri;
    public PipelineExportResult pipeline;
    public long started, finished;

    private EtlStatusReport(ExecutionStatus status, boolean error, boolean timeout, String executionIri, long started, long finished, PipelineInformationDao pipeline) {
        this.status = status;
        this.error = error;
        this.timeout = timeout;
        this.executionIri = executionIri;
        this.started = started;
        this.finished = finished;

        if (pipeline != null) {
            this.pipeline = new PipelineExportResult();
            this.pipeline.pipelineId = pipeline.getPipelineId();
            this.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
            this.pipeline.resultGraphIri = pipeline.getResultGraphIri();
        } else {
            this.pipeline = null;
        }
    }

    @NotNull
    public static EtlStatusReport createStandardReport(
            @NotNull ExecutionStatus executionStatus,
            @NotNull String executionIri,
            @Nullable PipelineInformationDao pipeline) {
        return new EtlStatusReport(executionStatus, false, false, executionIri, executionStatus.getStarted(), executionStatus.getFinished(), pipeline);
    }

    @NotNull
    public static EtlStatusReport createErrorReport(
            @NotNull String executionIri,
            @NotNull boolean timeout,
            @Nullable PipelineInformationDao pipeline) {
        return new EtlStatusReport(null, true, timeout, executionIri, -1, -1, pipeline);
    }
}
