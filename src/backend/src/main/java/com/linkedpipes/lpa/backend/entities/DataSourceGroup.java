package com.linkedpipes.lpa.backend.entities;

import java.util.ArrayList;
import java.util.List;

public class DataSourceGroup {
    public List<DataSource> dataSources;
    public List<Pipeline> pipelines;

    public DataSourceGroup(){
        dataSources = new ArrayList<>();
        pipelines = new ArrayList<>();
    }
}
