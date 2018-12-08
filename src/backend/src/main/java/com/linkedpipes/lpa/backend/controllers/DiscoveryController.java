package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.services.DiscoveryService;
import com.linkedpipes.lpa.backend.services.TtlConfigGenerator;
import com.linkedpipes.lpa.backend.util.UrlUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@SuppressWarnings("unused")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
    }

    @PostMapping("/api/pipelines/discover")
    public ResponseEntity<?> startDiscovery(@RequestBody List<DataSource> dataSourceList) throws IOException {
        if (dataSourceList == null || dataSourceList.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("No data sources were provided"), HttpStatus.BAD_REQUEST);
        }

        if(!dataSourceList.stream().allMatch(ds -> UrlUtils.isValidHttpUri(ds.uri))){
            return new ResponseEntity<>(new ErrorResponse("Some data sources are not valid HTTP URIS"), HttpStatus.BAD_REQUEST);
        }

        String discoveryConfig = TtlConfigGenerator.fromDataSourceList(dataSourceList);
        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);
        return ResponseEntity.ok(newDiscovery);
    }

    @PostMapping("/api/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws IOException {
        if (discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Discovery config not provided"), HttpStatus.BAD_REQUEST);
        }

        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);
        return ResponseEntity.ok(newDiscovery);
    }

    @GetMapping("/api/pipelines/discoverFromInputIri")
    public ResponseEntity<?> startDiscoveryFromInputIri(@RequestParam(value="discoveryConfigIri") String discoveryConfigIri) throws IOException{
        if (discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            return new ResponseEntity<>(new ErrorResponse("Input IRI not provided"), HttpStatus.BAD_REQUEST);
        }

        Discovery newDiscovery = discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        return ResponseEntity.ok(newDiscovery);
    }

    @GetMapping("/api/discovery/{id}/status")
    public ResponseEntity<String> getDiscoveryStatus(@PathVariable("id") String discoveryId) throws IOException {
        String response = discoveryService.getDiscoveryStatus(discoveryId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/discovery/{id}/pipelineGroups")
    public ResponseEntity<PipelineGroups> getPipelineGroups(@PathVariable("id") String discoveryId) throws IOException {
        PipelineGroups pipelineGroups = discoveryService.getPipelineGroups(discoveryId);

        return ResponseEntity.ok(pipelineGroups);
    }

}