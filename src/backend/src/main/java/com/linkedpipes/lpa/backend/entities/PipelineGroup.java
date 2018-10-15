package com.linkedpipes.lpa.backend.entities;

import java.util.ArrayList;
import java.util.List;

public class PipelineGroup {

    public ApplicationInstance visualizers;
    public List<DataSourceGroup> dataSourceGroups;

    public PipelineGroup(){
        dataSourceGroups = new ArrayList<>();
    }

}
