package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.services.rgml.RgmlService;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class D3ChordVisualizerController {

    private final RgmlService rgmlService;

    public D3ChordVisualizerController(ApplicationContext context){
        rgmlService = context.getBean(RgmlService.class);
    }

    @GetMapping("/api/chord/graph")
    public ResponseEntity<Graph> getGraph(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(rgmlService.getGraph(graphIri));
    }

    @PostMapping("/api/chord/nodesByUris")
    public ResponseEntity<List<Node>> getNodesByUris(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                     @Nullable @RequestBody List<String> nodeUrisList) {
        return ResponseEntity.ok(rgmlService.getNodesByUris(graphIri, nodeUrisList));
    }

    @GetMapping("/api/chord/nodes")
    public ResponseEntity<List<Node>> getNodes(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                               @Nullable @RequestParam(value = "limit", required = false) Integer limit,
                                               @Nullable @RequestParam(value = "offset", required = false) Integer offset) {
        return ResponseEntity.ok(rgmlService.getNodes(graphIri, limit, offset));
    }

    @GetMapping("/api/chord/edges")
    public ResponseEntity<List<Edge>> getEdges(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(rgmlService.getEdges(graphIri));
    }

    @PostMapping("/api/chord/matrix")
    public ResponseEntity<double[][]> getMatrix(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                @RequestParam("useWeights") boolean useWeights,
                                                @Nullable @RequestBody List<String> nodeUris) {
        if (nodeUris == null || nodeUris.isEmpty())
            return ResponseEntity.ok(new double[0][0]);

        return ResponseEntity.ok(rgmlService.getMatrix(graphIri, useWeights, nodeUris));
    }
}
