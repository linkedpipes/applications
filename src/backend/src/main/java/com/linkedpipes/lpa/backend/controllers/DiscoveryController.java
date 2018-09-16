package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import com.linkedpipes.lpa.backend.services.TtlConfigGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.List;

@RestController
public class DiscoveryController {

    private final HttpUrlConnector httpUrlConnector;
    private final DiscoveryServiceComponent discoveryService;

    public DiscoveryController(){
        httpUrlConnector = new HttpUrlConnector();
        discoveryService = new DiscoveryServiceComponent();
    }

    @RequestMapping("/pipelines/discover")
    public ResponseEntity<?> startDiscovery(@RequestBody List<DataSource> dataSourceList) throws IOException {
        if(dataSourceList == null || dataSourceList.isEmpty() ) {
            return new ResponseEntity(new ErrorResponse("No data sources were provided"), HttpStatus.BAD_REQUEST);
        }

        String discoveryConfig = new TtlConfigGenerator().createTtlConfig(dataSourceList);

        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);

        return ResponseEntity.ok(newDiscovery);
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws IOException{
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Discovery config not provided"), HttpStatus.BAD_REQUEST);
        }

        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);

        return ResponseEntity.ok(newDiscovery);
    }

    @RequestMapping("/pipelines/discoverFromInputIri")
    public ResponseEntity<?> startDiscoveryFromInputIri(@RequestParam( value="discoveryConfigIri") String discoveryConfigIri) throws IOException{
        if(discoveryConfigIri == null || discoveryConfigIri.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Input IRI not provided"), HttpStatus.BAD_REQUEST);
        }

        String response = httpUrlConnector.sendGetRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInputIri",
                "?iri=" + discoveryConfigIri, "application/json");

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/discovery/{id}/status")
    public ResponseEntity<String> getDiscoveryStatus(@PathVariable("id") String discoveryId) throws IOException{
        String response = discoveryService.getDiscoveryStatus(discoveryId);

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/discovery/{id}/pipelineGroups")
    @ResponseBody
    public ResponseEntity<Object> getPipelineGroups(@PathVariable("id") String discoveryId) throws IOException{
        PipelineGroups pipelineGroups = discoveryService.getPipelineGroups(discoveryId);

        return ResponseEntity.ok(pipelineGroups);
    }

}