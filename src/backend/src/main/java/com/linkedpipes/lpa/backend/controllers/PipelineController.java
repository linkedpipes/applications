package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.profile.PipelineExecution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.PipelineNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.services.DiscoveryService;
import com.linkedpipes.lpa.backend.services.ExecutorService;
import com.linkedpipes.lpa.backend.services.PipelineExportService;
import com.linkedpipes.lpa.backend.services.UserService;
import com.linkedpipes.lpa.backend.services.ScheduledExecutionService;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Profile("!disableDB")
public class PipelineController {

    private static final Logger logger = LoggerFactory.getLogger(PipelineController.class);

    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final ExecutorService executorService;
    @NotNull private final UserService userService;
    @NotNull private final PipelineExportService pipelineExportService;
    @NotNull private final ScheduledExecutionService scheduledExecutionService;

    public PipelineController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
        executorService = context.getBean(ExecutorService.class);
        userService = context.getBean(UserService.class);
        pipelineExportService = context.getBean(PipelineExportService.class);
        scheduledExecutionService = context.getBean(ScheduledExecutionService.class);
    }

    @GetMapping("/api/pipeline")
    public ResponseEntity<PipelineExportResult> getPipeline(@RequestParam(value = "pipelineIri") String pipelineIri) throws LpAppsException {
        try {
            return ResponseEntity.ok(pipelineExportService.retrievePipelineExport(pipelineIri));
        } catch (PipelineNotFoundException e) {
            throw new LpAppsException(HttpStatus.NOT_FOUND, "Pipeline not found: " + pipelineIri, e);
        }
    }

    /**
     * Call discovery service to export pipeline to ETL
     * @param discoveryId
     * @param pipelineUri
     * @return
     * @throws LpAppsException
     */
    @GetMapping("/api/pipeline/export")
    public ResponseEntity<PipelineExportResult> exportPipeline(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        return ResponseEntity.ok(discoveryService.exportPipeline(discoveryId, pipelineUri));
    }

    /**
     * Call discovery service to export pipeline to ETL, passing it the service description of our Virtuoso database
     * for future use when storing pipeline execution results
     * @param discoveryId
     * @param pipelineUri
     * @return
     * @throws LpAppsException
     */
    @GetMapping("/api/pipeline/exportWithSD")
    public ResponseEntity<PipelineExportResult> exportPipelineWithSD(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        return ResponseEntity.ok(pipelineExportService.exportPipeline(discoveryId, pipelineUri));
    }

    @NotNull
    @PostMapping("/api/pipeline/execute")
    public ResponseEntity<Execution> executePipeline(@NotNull @RequestParam(value="webId") String webId,
                                                     @NotNull @RequestParam(value = "etlPipelineIri") String etlPipelineIri,
                                                     @NotNull @RequestParam(value = "selectedVisualiser") String selectedVisualiser) throws LpAppsException {
        try {
            userService.addUserIfNotPresent(webId);
            Execution response = executorService.executePipeline(etlPipelineIri, webId, selectedVisualiser, true);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + webId);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    @PostMapping("/api/pipeline/repeat")
    public void executePipeline(@RequestParam(value="frequencyHours") long frequencyHours,
                                @NotNull @RequestParam(value="webId") String webId,
                                @NotNull @RequestParam(value = "executionIri") String executionIri,
                                @NotNull @RequestParam(value = "selectedVisualiser") String selectedVisualiser)
                                throws LpAppsException {
        if (frequencyHours <= 0) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Frequency must be positive");
        }

        scheduledExecutionService.repeatExecution(frequencyHours, true, executionIri, webId, selectedVisualiser);
    }

    @NotNull
    @PutMapping("/api/pipeline/repeat")
    public void executePipeline(@NotNull @RequestParam(value="repeat") boolean repeat,
                                @NotNull @RequestParam(value="executionIri") String executionIri)
                                throws LpAppsException {
        scheduledExecutionService.stopScheduledExecution(repeat, executionIri);
    }

    @NotNull
    @GetMapping("/api/pipeline/execution")
    public ResponseEntity<PipelineExecution> getExecution(@NotNull @RequestParam(value="executionIri") String executionIri) throws LpAppsException {
        return ResponseEntity.ok(userService.getExecution(executionIri));
    }

}
