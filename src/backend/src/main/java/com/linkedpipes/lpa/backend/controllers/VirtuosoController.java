package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.services.DiscoveryService;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SuppressWarnings("unused")
public class VirtuosoController {

    public static final String GRAPH_NAME_PREFIX = "https://applications.linkedpipes.com/graph/";
    private static final String SERVICE_DESCRIPTION_PATH = "/api/virtuoso/serviceDescription";

    @NotNull
    private final DiscoveryService discoveryService;

    public VirtuosoController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
    }

    /**
     * Get service description of our virtuoso SPARQL endpoint
     * @param graphId
     * @return
     */
    @GetMapping(SERVICE_DESCRIPTION_PATH)
    public ResponseEntity<String> serviceDescription(@RequestParam(value = "graphId") String graphId) {
        return ResponseEntity.ok(discoveryService.getVirtuosoServiceDescription(GRAPH_NAME_PREFIX + graphId));
    }
}
