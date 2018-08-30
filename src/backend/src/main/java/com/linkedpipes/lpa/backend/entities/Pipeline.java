package com.linkedpipes.lpa.backend.entities;

import java.util.List;

public class Pipeline {

    public String id;

    public String name;

    public String descriptor;

    public int componentCount;

    public List<DataSource> dataSources;
}
