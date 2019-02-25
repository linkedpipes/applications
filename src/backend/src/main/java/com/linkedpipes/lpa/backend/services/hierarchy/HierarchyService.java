package com.linkedpipes.lpa.backend.services.hierarchy;

import com.linkedpipes.lpa.backend.entities.hierarchy.TreemapNode;

import java.util.List;

public interface HierarchyService {

    List<TreemapNode> getTreemapHierarchy();

    List<TreemapNode> getTreemapHierarchyFromNamed(String resultGraphIri);

}
