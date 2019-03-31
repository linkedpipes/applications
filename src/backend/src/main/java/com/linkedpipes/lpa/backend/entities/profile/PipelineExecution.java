package com.linkedpipes.lpa.backend.entities.profile;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import java.util.Date;
public class PipelineExecution {
    public EtlStatus status;
    public String executionIri;
    public String selectedVisualiser;
    public long start, stop;
}
