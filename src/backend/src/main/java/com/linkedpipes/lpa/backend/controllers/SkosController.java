package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.VisualizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public class SkosController {

    private final VisualizationService visualizationService;

    public SkosController(){
        visualizationService = new VisualizationService();
    }

    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes() {
        return ResponseEntity.ok(visualizationService.getSkosSchemes());
    }

    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts() {
        return ResponseEntity.ok(visualizationService.getSkosConcepts());
    }

    @GetMapping("/api/skos/conceptsCounts")
    public void getSkosConceptsCounts() {
        //TODO
    }
}
