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

    @NotNull
    public static EtlStatusReport createStandardReport(
            @NotNull ExecutionStatus executionStatus,
            @NotNull String executionIri,
            @Nullable PipelineInformationDao pipeline) {
        EtlStatusReport report = new EtlStatusReport();
        report.status = executionStatus;
        report.error = false;
        report.timeout = false;
        report.executionIri = executionIri;
        report.started = executionStatus.getStarted();
        report.finished = executionStatus.getFinished();

        if (pipeline != null) {
            report.pipeline = new PipelineExportResult();
            report.pipeline.pipelineId = pipeline.getPipelineId();
            report.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
            report.pipeline.resultGraphIri = pipeline.getResultGraphIri();
        } else {
            report.pipeline = null;
        }

        return report;
    }

    @NotNull
    public static EtlStatusReport createErrorReport(
            @NotNull String executionIri,
            @NotNull boolean timeout,
            @Nullable PipelineInformationDao pipeline) {
        EtlStatusReport report = new EtlStatusReport();
        report.status = null;
        report.error = true;
        report.timeout = timeout;
        report.executionIri = executionIri;
        report.started = -1;
        report.finished = -1;
        if (pipeline != null) {
            report.pipeline = new PipelineExportResult();
            report.pipeline.pipelineId = pipeline.getPipelineId();
            report.pipeline.etlPipelineIri = pipeline.getEtlPipelineIri();
            report.pipeline.resultGraphIri = pipeline.getResultGraphIri();
        } else {
            report.pipeline = null;
        }

        return report;
    }
}
