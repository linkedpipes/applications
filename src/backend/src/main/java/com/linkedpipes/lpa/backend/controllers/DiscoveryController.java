package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.DiscoveryService;
import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.util.UrlUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("unused")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
    }

    @PostMapping("/api/pipelines/discover")
    public ResponseEntity<?> startDiscovery(@RequestBody List<DataSource> dataSourceList) throws LpAppsException {
        if (dataSourceList == null || dataSourceList.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "No data sources were provided");
        }

        if(!dataSourceList.stream().allMatch(ds -> UrlUtils.isValidHttpUri(ds.uri))){
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Some data sources are not valid HTTP URIS");
        }

        String discoveryConfig = TtlGenerator.getDiscoveryConfig(dataSourceList);
        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);
        return ResponseEntity.ok(newDiscovery);
    }

    @PostMapping("/api/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws LpAppsException{
        if (discoveryConfig == null || discoveryConfig.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Discovery config not provided");
        }

        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);
        return ResponseEntity.ok(newDiscovery);
    }

    @GetMapping("/api/pipelines/discoverFromInputIri")
    public ResponseEntity<Discovery> startDiscoveryFromInputIri(@RequestParam(value = "discoveryConfigIri") String discoveryConfigIri) throws LpAppsException {
        if (discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Input IRI not provided");
        }

        Discovery newDiscovery = discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        return ResponseEntity.ok(newDiscovery);
    }

    @GetMapping("/api/discovery/{id}/status")
    public ResponseEntity<String> getDiscoveryStatus(@PathVariable("id") String discoveryId) throws LpAppsException {
        String response = discoveryService.getDiscoveryStatus(discoveryId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/discovery/{id}/pipelineGroups")
    public ResponseEntity<PipelineGroups> getPipelineGroups(@PathVariable("id") String discoveryId) throws LpAppsException {
        PipelineGroups pipelineGroups = discoveryService.getPipelineGroups(discoveryId);

        return ResponseEntity.ok(pipelineGroups);
    }

}