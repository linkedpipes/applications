package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.List;

public class HierarchyNode {
    String uri;
    LocalizedValue localizedName;
    Integer size;
    Integer colorValue;
    //String parentId;
    List<HierarchyNode> children;

    public HierarchyNode(LocalizedValue localizedName, String uri, Integer size){
        this.localizedName = localizedName;
        this.uri = uri;
        this.size = size;
    }

}
