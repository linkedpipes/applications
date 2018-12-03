package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCount;
import com.linkedpipes.lpa.backend.entities.visualization.ConceptCountRequest;
import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import com.linkedpipes.lpa.backend.services.VisualizationService;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class SkosController {

    private final VisualizationService visualizationService;

    public SkosController(ApplicationContext context){
        visualizationService = context.getBean(VisualizationService.class);
    }

    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes() {
        return ResponseEntity.ok(visualizationService.getSkosSchemes());
    }

    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts() {
        return ResponseEntity.ok(visualizationService.getSkosConcepts());
    }

    @PostMapping("/api/skos/conceptsCounts")
    public ResponseEntity<List<ConceptCount>> getSkosConceptsCounts(@RequestBody ConceptCountRequest countRequest) {
        return ResponseEntity.ok(visualizationService.getSkosConceptsCounts(countRequest));
    }

}
