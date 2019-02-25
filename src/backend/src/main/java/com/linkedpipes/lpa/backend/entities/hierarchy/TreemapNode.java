package com.linkedpipes.lpa.backend.entities.hierarchy;

public class TreemapNode {

    public String id;
    public String parentId;
    public int size;

    public TreemapNode(String id, String parentId, int size) {
        this.id = id;
        this.parentId = parentId;
        this.size = size;
    }

    public TreemapNode() {
    }

}
