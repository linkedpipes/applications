package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.UUID;

@RestController
@SuppressWarnings("unused")
public class PipelineController {

    private final DiscoveryServiceComponent discoveryService;
    private final EtlServiceComponent etlService;

    public PipelineController() {
        discoveryService = new DiscoveryServiceComponent();
        etlService = new EtlServiceComponent();
    }

    @GetMapping("/api/pipeline")
    public ResponseEntity<Pipeline> getPipeline(@RequestParam(value = "pipelineUri") String pipelineUri) {
        Pipeline testPipeline = new Pipeline();
        testPipeline.id = pipelineUri;
        return ResponseEntity.ok(testPipeline);
    }

    @GetMapping("/api/pipeline/export")
    public ResponseEntity<PipelineExportResult> exportPipeline(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) throws IOException {
        PipelineExportResult response = discoveryService.exportPipeline(discoveryId, pipelineUri);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/pipeline/exportWithSD")
    public ResponseEntity<PipelineExportResult> exportPipelineWithSD(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) throws IOException {
        String serverUrl = Application.getConfig().getString("lpa.hostUrl");
        String graphId = UUID.randomUUID().toString() + "-" + discoveryId;
        ServiceDescription serviceDescription = new ServiceDescription(serverUrl + "/api/virtuosoServiceDescription?graphId=" + graphId);
        PipelineExportResult response = discoveryService.exportPipelineUsingSD(discoveryId, pipelineUri, serviceDescription);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/virtuosoServiceDescription")
    public ResponseEntity<String> serviceDescription(@RequestParam(value = "graphId") String graphId) {
        String prefix = "https://lpapps.com/";
        return ResponseEntity.ok(discoveryService.getVirtuosoServiceDescription(prefix + graphId));
    }

    @GetMapping("/api/pipeline/create")
    public void createPipeline(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) {

    }

    @GetMapping("/api/pipeline/execute")
    public ResponseEntity<Execution> executePipeline(@RequestParam(value = "etlPipelineIri") String etlPipelineIri) throws IOException {
        Execution response = etlService.executePipeline(etlPipelineIri);
        return ResponseEntity.ok(response);
    }

}
