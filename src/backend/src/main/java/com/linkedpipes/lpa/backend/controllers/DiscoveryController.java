package com.linkedpipes.lpa.backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.services.*;
import com.linkedpipes.lpa.backend.util.ThrowableUtils;
import com.linkedpipes.lpa.backend.util.UrlUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.atlas.json.JSON;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

@RestController
@SuppressWarnings("unused")
public class DiscoveryController {

    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final ExecutorService executorService;
    @NotNull private final UserService userService;
    @NotNull
    private final HandlerMethodIntrospector methodIntrospector;

    static final String SPARQL_ENDPOINT_IRI_PARAM = "sparqlEndpointIri";
    static final String DATA_SAMPLE_IRI_PARAM = "dataSampleIri";
    static final String NAMED_GRAPHS_PARAM = "namedGraphs";

    public DiscoveryController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
        executorService = context.getBean(ExecutorService.class);
        userService = context.getBean(UserService.class);
        methodIntrospector = context.getBean(HandlerMethodIntrospector.class);
    }

    @NotNull
    @PostMapping("/api/pipelines/discover")
    public ResponseEntity<Discovery> startDiscovery(@NotNull @RequestParam("webId") String webId,
                                                    @Nullable @RequestBody List<DataSource> dataSourceList) throws LpAppsException {
        if (dataSourceList == null || dataSourceList.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "No data sources were provided");
        }

        if (!dataSourceList.stream().allMatch(ds -> UrlUtils.isValidHttpUri(ds.uri))) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Some data sources are not valid HTTP URIS");
        }

        try {
            userService.addUserIfNotPresent(webId);
            String discoveryConfig = TtlGenerator.getDiscoveryConfig(dataSourceList);
            Discovery newDiscovery = executorService.startDiscoveryFromInput(discoveryConfig, webId);
            return ResponseEntity.ok(newDiscovery);
        } catch(UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    @PostMapping("/api/pipelines/discoverFromInput")
    public ResponseEntity<Discovery> startDiscoveryFromInput(@NotNull @RequestParam("webId") String webId,
                                                             @Nullable @RequestBody String discoveryConfig) throws LpAppsException {
        if (discoveryConfig == null || discoveryConfig.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Discovery config not provided");
        }

        try {
            userService.addUserIfNotPresent(webId);
            Discovery newDiscovery = executorService.startDiscoveryFromInput(discoveryConfig, webId);
            return ResponseEntity.ok(newDiscovery);
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    @PostMapping("/api/pipelines/discoverFromInputIri")
    public ResponseEntity<Discovery> startDiscoveryFromInputIri(@NotNull @RequestParam("webId") String webId,
                                                                @NotNull @RequestParam(value = "discoveryConfigIri") String discoveryConfigIri) throws LpAppsException {
        try {
            userService.addUserIfNotPresent(webId);
            Discovery newDiscovery = executorService.startDiscoveryFromInputIri(discoveryConfigIri, webId);
            return ResponseEntity.ok(newDiscovery);
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    /**
     * Start discovery of pipelines using data in SPARQL endpoint
     * @param sparqlEndpointIri
     * @param dataSampleIri
     * @param namedGraphs
     * @param webId
     * @return
     * @throws LpAppsException
     */
    @NotNull
    @PostMapping("/api/pipelines/discoverFromEndpoint")
    public ResponseEntity<Discovery> startDiscoveryFromEndpoint(@NotNull @RequestParam(SPARQL_ENDPOINT_IRI_PARAM) String sparqlEndpointIri,
                                                                @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri,
                                                                @NotNull @RequestParam("webId") String webId,
                                                                @Nullable @RequestParam List<String> namedGraphs) throws LpAppsException {
        if(namedGraphs == null)
            namedGraphs = new ArrayList<>();

        if (sparqlEndpointIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "SPARQL Endpoint IRI not provided");
        }
        if (dataSampleIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Data Sample IRI not provided");
        }

        try {
            userService.addUserIfNotPresent(webId);
            String templateDescUri = getTemplateDescUri(sparqlEndpointIri, dataSampleIri, namedGraphs);
            String discoveryConfig = TtlGenerator.getDiscoveryConfig(List.of(new DataSource(templateDescUri)));
            return ResponseEntity.ok(executorService.startDiscoveryFromInput(discoveryConfig, webId, sparqlEndpointIri, dataSampleIri, namedGraphs));
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    private String getTemplateDescUri(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri, @NotNull List<String> namedGraphs) {
        Method templateDescriptionMethod = ThrowableUtils.rethrowAsUnchecked(() ->
                DataSourceController.class.getDeclaredMethod("getTemplateDescription", String.class, String.class, List.class));

        return methodIntrospector.getHandlerMethodUri(DataSourceController.class, templateDescriptionMethod)
                .requestParam(SPARQL_ENDPOINT_IRI_PARAM, sparqlEndpointIri)
                .requestParam(DATA_SAMPLE_IRI_PARAM, dataSampleIri)
                .requestParam(NAMED_GRAPHS_PARAM, StringUtils.join(namedGraphs, ","))
                .build()
                .toString();
    }

    /**
     * Get pipelines found for discovery, grouped by visualizer
     * @param discoveryId
     * @return
     * @throws LpAppsException
     */
    @GetMapping("/api/discovery/{id}/pipelineGroups")
    public ResponseEntity<PipelineGroups> getPipelineGroups(@NotNull @PathVariable("id") String discoveryId) throws LpAppsException {
        PipelineGroups pipelineGroups = discoveryService.getPipelineGroups(discoveryId);

        return ResponseEntity.ok(pipelineGroups);
    }

}
