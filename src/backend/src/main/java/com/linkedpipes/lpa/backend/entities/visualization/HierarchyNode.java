package com.linkedpipes.lpa.backend.entities.visualization;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.List;

public class HierarchyNode {
    public String id;
    public LocalizedValue label;
    public String parentId;

    //TODO might have to change below to Integer, depends if Google Charts accepts only whole integers
    public Double size;

    /*public HierarchyNode(LocalizedValue label, String id, Integer size) {
        this.label = label;
        this.id = id;
        this.size = size;
    }

    public HierarchyNode(LocalizedValue label, String id, Integer size, List<HierarchyNode> children) {
        this.label = label;
        this.id = id;
        this.size = size;
    }*/

    public HierarchyNode(String id, LocalizedValue label, String parentId, Double size) {
        this.id = id;
        this.label = label;
        this.parentId = parentId;
        this.size = size;
    }
}
