package com.linkedpipes.lpa.backend.entities.profile;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
public class PipelineExecution {
    public EtlStatus status;
    public String executionIri;
    public String etlPipelineIri;
    public String selectedVisualiser;
    public long started, finished;
    public boolean scheduleOn, startedByUser;
}
