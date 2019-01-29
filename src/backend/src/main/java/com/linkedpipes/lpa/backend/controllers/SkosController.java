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
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
public class SkosController {

    private final VisualizationService visualizationService;

    public SkosController(ApplicationContext context){
        visualizationService = context.getBean(VisualizationService.class);
    }

    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return Optional.ofNullable(graphIri)
                .map(visualizationService::getSkosSchemesFromNamed)
                .or(() -> Optional.of(visualizationService.getSkosSchemes()))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return Optional.ofNullable(graphIri)
                .map(visualizationService::getSkosConceptsFromNamed)
                .or(() -> Optional.of(visualizationService.getSkosConcepts()))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @PostMapping("/api/skos/conceptsCounts")
    public ResponseEntity<List<ConceptCount>> getSkosConceptsCounts(@RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                                    @RequestBody ConceptCountRequest countRequest) {
        return Optional.ofNullable(graphIri)
                .map(iri -> visualizationService.getSkosConceptsCountsFromNamed(iri, countRequest))
                .or(() -> Optional.of(visualizationService.getSkosConceptsCounts(countRequest)))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

}
