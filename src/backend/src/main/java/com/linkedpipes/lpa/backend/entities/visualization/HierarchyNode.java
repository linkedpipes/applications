package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.ArrayList;
import java.util.List;

public class HierarchyNode {
    public String uri;
    public LocalizedValue localizedName;
    public Integer size;
    public Integer colorValue;
    //public String parentId;
    public List<HierarchyNode> children;

    public HierarchyNode(LocalizedValue localizedName, String uri, Integer size){
        this.localizedName = localizedName;
        this.uri = uri;
        this.size = size;
        this.children = new ArrayList();
    }

    public HierarchyNode(LocalizedValue localizedName, String uri, Integer size, List<HierarchyNode> children){
        this.localizedName = localizedName;
        this.uri = uri;
        this.size = size;
        this.children = children;
    }

}
