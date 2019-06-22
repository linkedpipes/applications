package com.linkedpipes.lpa.backend.entities.profile;

import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.linkedpipes.lpa.backend.entities.database.ExecutionDao;

public class PipelineExecution {
    public EtlStatus status;
    public String executionIri;
    public String etlPipelineIri;
    public String selectedVisualiser;
    public long started, finished, frequencyHours;
    public boolean scheduleOn, startedByUser;

    public static PipelineExecution getPipelineExecutionFromDao(final ExecutionDao e) {
        PipelineExecution exec = new PipelineExecution();
        exec.status = e.getStatus();
        exec.executionIri = e.getExecutionIri();
        exec.etlPipelineIri = e.getPipeline().getEtlPipelineIri();
        exec.selectedVisualiser = e.getSelectedVisualiser();
        exec.started = e.getStarted().getTime() / 1000L;
        exec.scheduleOn = e.isScheduled();
        exec.startedByUser = e.isStartedByUser();
        exec.frequencyHours = e.getFrequencyHours();
        if (e.getFinished() != null) {
            exec.finished = e.getFinished().getTime() / 1000L;
        } else {
            exec.finished = -1;
        }
        return exec;
    }
}
