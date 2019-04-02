package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.PipelineNotFoundException;
import com.linkedpipes.lpa.backend.services.DiscoveryService;
import com.linkedpipes.lpa.backend.services.ExecutorService;
import com.linkedpipes.lpa.backend.services.UserService;
import com.linkedpipes.lpa.backend.services.PipelineExportService;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SuppressWarnings("unused")
public class PipelineController {

    private static final Logger logger = LoggerFactory.getLogger(PipelineController.class);
    public static final String GRAPH_NAME_PREFIX = "https://lpapps.com/graph/";

    private static final String SERVICE_DESCRIPTION_PATH = "/api/virtuosoServiceDescription";

    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final ExecutorService executorService;
    @NotNull private final UserService userService;
    @NotNull private final PipelineExportService pipelineExportService;

    public PipelineController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
        executorService = context.getBean(ExecutorService.class);
        userService = context.getBean(UserService.class);
        pipelineExportService = context.getBean(PipelineExportService.class);
    }

    @GetMapping("/api/pipeline")
    public ResponseEntity<PipelineExportResult> getPipeline(@RequestParam(value = "pipelineIri") String pipelineIri) throws LpAppsException {
        try {
            return ResponseEntity.ok(pipelineExportService.retrievePipelineExport(pipelineIri));
        } catch (PipelineNotFoundException e) {
            throw new LpAppsException(HttpStatus.NOT_FOUND, "Pipeline not found: " + pipelineIri, e);
        }
    }

    @GetMapping("/api/pipeline/export")
    public ResponseEntity<PipelineExportResult> exportPipeline(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        PipelineExportResult response = discoveryService.exportPipeline(discoveryId, pipelineUri);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/pipeline/exportWithSD")
    public ResponseEntity<PipelineExportResult> exportPipelineWithSD(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        return ResponseEntity.ok(pipelineExportService.exportPipeline(discoveryId, pipelineUri));
    }

    @GetMapping(SERVICE_DESCRIPTION_PATH)
    public ResponseEntity<String> serviceDescription(@RequestParam(value = "graphId") String graphId) {
        return ResponseEntity.ok(discoveryService.getVirtuosoServiceDescription(GRAPH_NAME_PREFIX + graphId));
    }

    @GetMapping("/api/pipeline/create")
    public void createPipeline(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) {

    }

    @NotNull
    @PostMapping("/api/pipeline/execute")
    public ResponseEntity<Execution> executePipeline(@NotNull @RequestParam(value="webId") String webId,
                                                     @NotNull @RequestParam(value = "etlPipelineIri") String etlPipelineIri,
                                                     @NotNull @RequestParam(value = "selectedVisualiser") String selectedVisualiser) throws LpAppsException {
        try {
            userService.addUserIfNotPresent(webId);
            Execution response = executorService.executePipeline(etlPipelineIri, webId, selectedVisualiser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + webId);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

}
