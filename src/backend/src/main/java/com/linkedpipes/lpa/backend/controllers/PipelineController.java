package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.profile.PipelineExecution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.PipelineNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.services.*;
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
     * Call Discovery service to export pipeline to ETL.
     *
     * @param discoveryId the ID of the Discovery to export the pipeline from
     * @param pipelineUri the URI of the pipeline to export
     * @return the result of the export operation
     * @throws LpAppsException if the export fails for any reason
     */
    @GetMapping("/api/pipeline/export")
    public ResponseEntity<PipelineExportResult> exportPipeline(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        return ResponseEntity.ok(discoveryService.exportPipeline(discoveryId, pipelineUri));
    }

    /**
     * Call discovery service to export pipeline to ETL, passing it the service description of our Virtuoso database
     * for future use when storing pipeline execution results.
     *
     * @param discoveryId the ID of the Discovery to export the pipeline from
     * @param pipelineUri the URI of the pipeline to export
     * @return the result of the export operation
     * @throws LpAppsException if the export fails for any reason
     */
    @GetMapping("/api/pipeline/exportWithSD")
    public ResponseEntity<PipelineExportResult> exportPipelineWithSD(@NotNull @RequestParam(value = "discoveryId") String discoveryId, @NotNull @RequestParam(value = "pipelineUri") String pipelineUri) throws LpAppsException {
        return ResponseEntity.ok(pipelineExportService.exportPipeline(discoveryId, pipelineUri));
    }

    /**
     * Execute a pipeline once.
     *
     * @param webId user identifier
     * @param etlPipelineIri IRI of the pipeline to execute
     * @param selectedVisualiser visualiser that was selected by user on frontend (will be returned later)
     * @return result of executePipeline operation
     */
    @NotNull
    @PostMapping("/api/pipeline/execute")
    public ResponseEntity<Execution> executePipeline(@NotNull @RequestParam(value = "webId") String webId,
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

    /**
     * Set the pipeline to be executed periodically.
     *
     * @param frequencyHours interval (in hours) after which the pipeline will be executed once again
     * @param webId user identifier
     * @param executionIri IRI of first pipeline execution
     * @param selectedVisualiser visualiser that was selected by user on frontend (will be returned later)
     */
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

    /**
     * Toggle a periodic execution of a pipeline on/off.
     *
     * @param repeat is the periodic execution on or off
     * @param executionIri IRI of first pipeline execution
     */
    @PutMapping("/api/pipeline/repeat")
    public void executePipeline(@RequestParam(value = "repeat") boolean repeat,
                                @NotNull @RequestParam(value = "executionIri") String executionIri) {
        scheduledExecutionService.stopScheduledExecution(repeat, executionIri);
    }

    /**
     * Get more information about this pipeline execution.
     *
     * @param executionIri IRI of first pipeline execution
     * @return information about pipeline execution
     */
    @NotNull
    @GetMapping("/api/pipeline/execution")
    public ResponseEntity<PipelineExecution> getExecution(@NotNull @RequestParam(value="executionIri") String executionIri) throws LpAppsException {
        return ResponseEntity.ok(userService.getExecution(executionIri));
    }

}
