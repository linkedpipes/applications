package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.services.virtuoso.VirtuosoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VirtuosoController {

    public static final String GRAPH_NAME_PREFIX = "https://applications.linkedpipes.com/graph/";
    private static final String SERVICE_DESCRIPTION_PATH = "/api/virtuoso/serviceDescription";

    /**
     * Get service description of our virtuoso SPARQL endpoint
     * @param graphId
     * @return
     */
    @GetMapping(SERVICE_DESCRIPTION_PATH)
    public ResponseEntity<String> serviceDescription(@RequestParam(value = "graphId") String graphId) {
        return ResponseEntity.ok(TtlGenerator.getVirtuosoServiceDescription(GRAPH_NAME_PREFIX + graphId));
    }

    /**
     * Check if a named graph exists in our Virtuoso db
     * @param graphName - full URI identifying the named graph
     * @return
     * @throws LpAppsException
     */
    @GetMapping("api/virtuoso/graphExists")
    public ResponseEntity checkNamedGraphExists(@RequestParam(value = "graphName") String graphName) throws LpAppsException {
        boolean exists = VirtuosoService.checkNamedGraphExists(graphName);
        if (exists)
            return ResponseEntity.ok("");

        throw new LpAppsException(HttpStatus.NOT_FOUND, "Named graph does not exist.");
    }
}
