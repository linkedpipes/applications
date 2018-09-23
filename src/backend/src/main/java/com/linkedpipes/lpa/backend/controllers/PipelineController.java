package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@SuppressWarnings("unused")
public class PipelineController {

    private final DiscoveryServiceComponent discoveryService;
    private final EtlServiceComponent etlService;

    public PipelineController(){
        discoveryService = new DiscoveryServiceComponent();
        etlService = new EtlServiceComponent();
    }

    @RequestMapping("/pipeline")
    @ResponseBody
    public ResponseEntity<Pipeline> getPipeline(@RequestParam( value="pipelineUri") String pipelineUri){
        Pipeline testPipeline = new Pipeline();
        testPipeline.id = pipelineUri;
        return new ResponseEntity<>(testPipeline, HttpStatus.OK);
    }

    @GetMapping("/pipeline/export")
    @ResponseBody
    public ResponseEntity<String> exportPipeline(@RequestParam( value="discoveryId") String discoveryId, @RequestParam( value="pipelineUri") String pipelineUri) throws IOException{
        String response = discoveryService.exportPipeline(discoveryId, pipelineUri);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/pipeline/export")
    @ResponseBody
    public ResponseEntity<String> exportPipeline(@RequestParam( value="discoveryId") String discoveryId, @RequestParam( value="pipelineUri") String pipelineUri, @RequestBody String serviceDescriptionIri) throws IOException{
        ServiceDescription serviceDescription = new ServiceDescription(serviceDescriptionIri);

        String response = discoveryService.exportPipelineUsingSD(discoveryId, pipelineUri, serviceDescription);

        return ResponseEntity.ok(response);
    }

    @RequestMapping("/pipeline/create")
    @ResponseBody
    public void createPipeline(@RequestParam( value="discoveryId") String discoveryId, @RequestParam( value="pipelineUri") String pipelineUri){

    }

    @RequestMapping("/pipeline/execute")
    public ResponseEntity<String> executePipeline(@RequestParam( value="etlPipelineIri") String etlPipelineIri) throws IOException{
        String response = etlService.executePipeline(etlPipelineIri);

        return ResponseEntity.ok(response);
    }

}