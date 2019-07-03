package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.visualization.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
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
     * Get list of all SKOS schemes from linked data in the Virtuoso.
     *
     * @param graphIri IRI of the result graph present in the Virtuoso
     * @return a list of SKOS schemes
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @GetMapping("/api/skos/schemes")
    public ResponseEntity<List<Scheme>> getSkosSchemes(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(visualizationService.getSkosSchemes(graphIri));
    }

    /**
     * Get a one-deep subtree of a SKOS scheme hierarchy tree in the Virtuoso. The returned subtree will contain at most
     * {@code conceptUri} and its direct children.
     *
     * @param resultGraphIri IRI of the result graph present in the Virtuoso
     * @param schemeUri      URI of the SKOS scheme to query the concepts from
     * @param conceptUri     URI of the SKOS concept to be the root of the returned subtree
     * @return a list of all matched SKOS concepts
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @NotNull
    @GetMapping("/api/skos/schemeSubtree")
    public ResponseEntity<List<HierarchyNode>> getSkosSchemeSubtree(@Nullable @RequestParam(value = "resultGraphIri", required = false) String resultGraphIri,
                                                                    @NotNull @RequestParam("schemeUri") String schemeUri,
                                                                    @Nullable @RequestParam(value = "conceptUri", required = false) String conceptUri) throws LpAppsException {
        return ResponseEntity.ok(visualizationService.getSkosSchemeSubtree(resultGraphIri, schemeUri, conceptUri));
    }

    /**
     * Get list of all SKOS concepts from linked data in the Virtuoso
     *
     * @param graphIri IRI of the result graph present in the Virtuoso
     * @return a list of all matched SKOS concepts
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @NotNull
    @GetMapping("/api/skos/concepts")
    public ResponseEntity<List<Concept>> getSkosConcepts(@RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(visualizationService.getSkosConcepts(graphIri));
    }

    /**
     * Get the counts of SKOS concepts in the Virtuoso, grouped by the properties to the particular SKOS concepts.
     *
     * @param graphIri     IRI of the result graph present in the Virtuoso
     * @param countRequest a request object
     * @return the list of counts of concepts
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @PostMapping("/api/skos/conceptsCounts")
    public ResponseEntity<List<ConceptCount>> getSkosConceptsCounts(@RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                                    @RequestBody ConceptCountRequest countRequest) throws LpAppsException {
        return ResponseEntity.ok(visualizationService.getSkosConceptsCounts(graphIri, countRequest));
    }

}
