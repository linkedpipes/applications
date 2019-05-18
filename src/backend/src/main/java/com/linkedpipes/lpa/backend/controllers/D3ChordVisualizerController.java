package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
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

    /**
     * Retrieve an object representing an RGML Graph entity from the RDF named graph {@code graphIri}.
     *
     * @param graphIri the RDF named graph to retrieve the RGML Graph from
     * @return an RGML Graph
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @GetMapping("/api/chord/graph")
    public ResponseEntity<Graph> getGraph(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(rgmlService.getGraph(graphIri));
    }

    @PostMapping("/api/chord/nodesByUris")
    public ResponseEntity<List<Node>> getNodesByUris(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                     @Nullable @RequestBody List<String> nodeUrisList) throws LpAppsException {
        return ResponseEntity.ok(rgmlService.getNodesByUris(graphIri, nodeUrisList));
    }

    /**
     * Retrieve RGML Nodes belonging to a particular RGML Graph from the RDF named graph {@code graphIri}. Pagination is
     * supported with parameters {@code limit} and {@code offset}.
     *
     * @param graphIri the RDF named graph to retrieve the RGML Nodes from
     * @param limit the limit of the results (maximum amount of nodes to display)
     * @param offset the offset of the results (amount of nodes to skip)
     * @return a list of retrieved nodes
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @GetMapping("/api/chord/nodes")
    public ResponseEntity<List<Node>> getNodes(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                               @Nullable @RequestParam(value = "limit", required = false) Integer limit,
                                               @Nullable @RequestParam(value = "offset", required = false) Integer offset) throws LpAppsException {
        return ResponseEntity.ok(rgmlService.getNodes(graphIri, limit, offset));
    }

    @GetMapping("/api/chord/edges")
    public ResponseEntity<List<Edge>> getEdges(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(rgmlService.getEdges(graphIri));
    }

    /**
     * Retrieve a matrix of Edge weights in an RGML Graph. The order of weights follows the order of the RGML Nodes
     * which would be returned by a call to {@link #getNodes(String, Integer, Integer)}.
     *
     * @param graphIri the RDF named graph to retrieve the RGML Nodes from
     * @param useWeights TODO probably remove this parameter, as we don't use it
     * @param nodeUris if not null, only returns a matrix for Edges between the given Nodes
     * @return a matrix of weights
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @PostMapping("/api/chord/matrix")
    public ResponseEntity<double[][]> getMatrix(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                @RequestParam("useWeights") boolean useWeights,
                                                @Nullable @RequestBody List<String> nodeUris) throws LpAppsException {
        if (nodeUris == null || nodeUris.isEmpty())
            return ResponseEntity.ok(new double[0][0]);

        return ResponseEntity.ok(rgmlService.getMatrix(graphIri, useWeights, nodeUris));
    }

}
