package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.hierarchy.TreemapNode;
import com.linkedpipes.lpa.backend.services.hierarchy.HierarchyService;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class HierarchyController {

    @NotNull
    private final HierarchyService hierarchyService;

    public HierarchyController(@NotNull ApplicationContext context) {
        hierarchyService = context.getBean(HierarchyService.class);
    }

    @NotNull
    @GetMapping("/api/hierarchy/treemap")
    public ResponseEntity<List<TreemapNode>> getTreemapHierarchy(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri) {
        resultGraphIri = "http://linked.opendata.cz/resource/dataset/cpv-2008"; // TODO: 25.2.19 remove this hard-coded value after demo
        List<TreemapNode> hierarchy = Optional.ofNullable(resultGraphIri)
                .map(hierarchyService::getTreemapHierarchyFromNamed)
                .orElseGet(hierarchyService::getTreemapHierarchy);
        return ResponseEntity.ok(hierarchy);
    }

}
