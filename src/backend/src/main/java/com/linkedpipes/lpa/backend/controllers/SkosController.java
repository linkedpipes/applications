package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.services.VisualizationService;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class SkosController {

    private final VisualizationService visualizationService;

    public SkosController(ApplicationContext context){
        visualizationService = context.getBean(VisualizationService.class);
    }

    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(visualizationService.getSkosSchemes(graphIri));
    }

    @NotNull
    @GetMapping("/api/skos/schemeSubtree")
    public ResponseEntity<List<HierarchyNode>> getSkosSchemeSubtree(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri,
                                                             @NotNull @RequestParam("schemeUri") String schemeUri, @Nullable @RequestParam(value = "conceptUri", required = false) String conceptUri) {
        return ResponseEntity.ok(visualizationService.getSkosSchemeSubtree(resultGraphIri, schemeUri, conceptUri));
    }

    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(visualizationService.getSkosConcepts(graphIri));
    }

    @PostMapping("/api/skos/conceptsCounts")
    public ResponseEntity<List<ConceptCount>> getSkosConceptsCounts(@RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                                    @RequestBody ConceptCountRequest countRequest) {
        return ResponseEntity.ok(visualizationService.getSkosConceptsCounts(graphIri, countRequest));
    }

}
