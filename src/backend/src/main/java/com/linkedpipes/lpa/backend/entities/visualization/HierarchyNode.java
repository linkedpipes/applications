package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.List;

public class HierarchyNode {
    public String id;
    public LocalizedValue label;
    public String parentId;
    public double size;

    public HierarchyNode(LocalizedValue label, String id, Integer size) {
        this.label = label;
        this.id = id;
        this.size = size;
    }

    public HierarchyNode(LocalizedValue label, String id, Integer size, List<HierarchyNode> children) {
        this.label = label;
        this.id = id;
        this.size = size;
    }

    public HierarchyNode(String id, LocalizedValue label, String parentId, double size) {
        this.id = id;
        this.label = label;
        this.parentId = parentId;
        this.size = size;
    }

    public HierarchyNode() {
    }

}
