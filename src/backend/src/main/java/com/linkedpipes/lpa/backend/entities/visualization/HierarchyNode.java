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

}
