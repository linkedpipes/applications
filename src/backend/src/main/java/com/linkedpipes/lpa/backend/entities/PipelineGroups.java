package com.linkedpipes.lpa.backend.entities;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class PipelineGroups {
    @SerializedName("pipelines")
    public List<Pipeline> pipelines;

    public PipelineGroups(){
        pipelines = new ArrayList<>();
    }
}
