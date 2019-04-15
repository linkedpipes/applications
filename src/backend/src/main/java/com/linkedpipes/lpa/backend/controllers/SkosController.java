package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.services.VisualizationService;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkosController {

    private final VisualizationService visualizationService;

    public SkosController(ApplicationContext context){
        visualizationService = context.getBean(VisualizationService.class);
    }

    /**
     * Get list of all skos schemes from linked data in SPARQL endpoint
     * @param graphIri
     * @return
     */
    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(visualizationService.getSkosSchemes(graphIri));
    }

    /**
     * Get subtree of a skos scheme hierarchy tree in SPARQL endpoint
     * @param resultGraphIri
     * @param schemeUri
     * @param conceptUri
     * @return
     */
    @NotNull
    @GetMapping("/api/skos/schemeSubtree")
    public ResponseEntity<List<HierarchyNode>> getSkosSchemeSubtree(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri,
                                                             @NotNull @RequestParam("schemeUri") String schemeUri, @Nullable @RequestParam(value = "conceptUri", required = false) String conceptUri) {
        return ResponseEntity.ok(visualizationService.getSkosSchemeSubtree(resultGraphIri, schemeUri, conceptUri));
    }

    /**
     * Get list of all skos concepts from linked data in SPARQL endpoint
     * @param graphIri
     * @return
     */
    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(visualizationService.getSkosConcepts(graphIri));
    }

    /**
     * Get the count of skos concepts in SPARQL endpoint
     * @param graphIri
     * @param countRequest
     * @return
     */
    @PostMapping("/api/skos/conceptsCounts")
    public ResponseEntity<List<ConceptCount>> getSkosConceptsCounts(@RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                                    @RequestBody ConceptCountRequest countRequest) {
        return ResponseEntity.ok(visualizationService.getSkosConceptsCounts(graphIri, countRequest));
    }

}
