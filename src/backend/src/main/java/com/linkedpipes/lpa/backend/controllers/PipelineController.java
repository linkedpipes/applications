package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.interfaces.IDiscoveryService;
import com.linkedpipes.lpa.backend.services.interfaces.IEtlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@SuppressWarnings("unused")
public class PipelineController {

    private static final Logger logger = LoggerFactory.getLogger(PipelineController.class);
    private static final String GRAPH_NAME_PREFIX = "https://lpapps.com/";

    private final IDiscoveryService discoveryService;
    private final IEtlService etlService;

    public PipelineController(ApplicationContext context) {
        discoveryService = context.getBean(IDiscoveryService.class);
        etlService = context.getBean(IEtlService.class);
    }

    @GetMapping("/api/pipeline")
    public ResponseEntity<Pipeline> getPipeline(@RequestParam(value = "pipelineUri") String pipelineUri) {
        Pipeline testPipeline = new Pipeline();
        testPipeline.id = pipelineUri;
        return ResponseEntity.ok(testPipeline);
    }

    @GetMapping("/api/pipeline/export")
    public ResponseEntity<PipelineExportResult> exportPipeline(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        PipelineExportResult response = discoveryService.exportPipeline(discoveryId, pipelineUri);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/pipeline/exportWithSD")
    public ResponseEntity<PipelineExportResult> exportPipelineWithSD(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        String serverUrl = Application.getConfig().getString("lpa.hostUrl");
        String graphId = UUID.randomUUID().toString() + "-" + discoveryId;
        ServiceDescription serviceDescription = new ServiceDescription(serverUrl + "/api/virtuosoServiceDescription?graphId=" + graphId);
        PipelineExportResult response = discoveryService.exportPipelineUsingSD(discoveryId, pipelineUri, serviceDescription);
        logger.debug("resultGraphIri = " + response.resultGraphIri);
        response.resultGraphIri = GRAPH_NAME_PREFIX + graphId;
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/virtuosoServiceDescription")
    public ResponseEntity<String> serviceDescription(@RequestParam(value = "graphId") String graphId) {
        return ResponseEntity.ok(discoveryService.getVirtuosoServiceDescription(GRAPH_NAME_PREFIX + graphId));
    }

    @GetMapping("/api/pipeline/create")
    public void createPipeline(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) {

    }

    @GetMapping("/api/pipeline/execute")
    public ResponseEntity<Execution> executePipeline(@RequestParam(value = "etlPipelineIri") String etlPipelineIri) throws LpAppsException {
        Execution response = etlService.executePipeline(etlPipelineIri);
        return ResponseEntity.ok(response);
    }

}
