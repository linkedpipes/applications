package com.linkedpipes.lpa.backend.entities;

import java.util.ArrayList;
import java.util.List;

public class PipelineGroup {
    public ApplicationInstance applicationInstance;
    public List<Pipeline> pipelines;

    public PipelineGroup(){
        pipelines = new ArrayList<>();
    }
}
