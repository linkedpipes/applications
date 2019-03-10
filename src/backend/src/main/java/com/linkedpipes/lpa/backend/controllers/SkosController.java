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
    public ResponseEntity<List<Scheme>> getSkosSchemes(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return Optional.ofNullable(graphIri)
                .map(visualizationService::getSkosSchemesFromNamed)
                .or(() -> Optional.of(visualizationService.getSkosSchemes()))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @NotNull
    @GetMapping("/api/skos/scheme")
    public ResponseEntity<List<HierarchyNode>> getSkosScheme(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri,
                                                             @NotNull @RequestParam("schemeUri") String schemeUri) {
        return Optional.ofNullable(resultGraphIri)
                .map(iri -> visualizationService.getSkosSchemeFromNamed(iri, schemeUri))
                .or(() -> Optional.of(visualizationService.getSkosScheme(schemeUri)))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @NotNull
    @GetMapping("/api/skos/schemeSubtree")
    public ResponseEntity<List<HierarchyNode>> getSkosSchemeSubtree(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri,
                                                             @NotNull @RequestParam("schemeUri") String schemeUri, @Nullable @RequestParam(value = "conceptUri", required = false) String conceptUri) {
        return Optional.ofNullable(resultGraphIri)
                .map(iri -> visualizationService.getSkosSchemeSubtreeFromNamed(iri, schemeUri, conceptUri))
                .or(() -> Optional.of(visualizationService.getSkosSchemeSubtree(schemeUri, conceptUri)))
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
