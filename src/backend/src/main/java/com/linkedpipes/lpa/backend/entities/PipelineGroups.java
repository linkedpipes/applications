package com.linkedpipes.lpa.backend.entities;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class PipelineGroups {
    public List<PipelineGroup> pipelineGroups;

    public PipelineGroups(){
        pipelineGroups = new ArrayList<>();
    }
}
