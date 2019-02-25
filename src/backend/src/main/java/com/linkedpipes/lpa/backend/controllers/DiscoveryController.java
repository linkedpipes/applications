package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.DiscoveryService;
import com.linkedpipes.lpa.backend.services.TtlGenerator;
import com.linkedpipes.lpa.backend.util.UrlUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.util.List;

@RestController
@SuppressWarnings("unused")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    static final String SPARQL_ENDPOINT_IRI_PARAM = "sparqlEndpointIri";
    static final String DATA_SAMPLE_IRI_PARAM = "dataSampleIri";
    static final String NAMED_GRAPH_PARAM = "namedGraph";

    public DiscoveryController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
    }

    @PostMapping("/api/pipelines/discover")
    public ResponseEntity<Discovery> startDiscovery(@RequestBody List<DataSource> dataSourceList) throws LpAppsException {
        if (dataSourceList == null || dataSourceList.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "No data sources were provided");
        }

        if (!dataSourceList.stream().allMatch(ds -> UrlUtils.isValidHttpUri(ds.uri))) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Some data sources are not valid HTTP URIS");
        }

        String discoveryConfig = TtlGenerator.getDiscoveryConfig(dataSourceList);
        Discovery newDiscovery = discoveryService.startDiscoveryFromInput(discoveryConfig);
        return ResponseEntity.ok(newDiscovery);
    }

    @PostMapping("/api/pipelines/discoverFromInput")
    public ResponseEntity<Discovery> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws LpAppsException {
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

    @NotNull
    @PostMapping("/api/pipelines/discoverFromEndpoint")
    public ResponseEntity<Discovery> startDiscoveryFromEndpoint(@NotNull @RequestParam(SPARQL_ENDPOINT_IRI_PARAM) String sparqlEndpointIri,
                                                                @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri,
                                                                @NotNull @RequestParam(NAMED_GRAPH_PARAM) String namedGraph) throws LpAppsException {
        if (sparqlEndpointIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "SPARQL Endpoint IRI not provided");
        }
        if (dataSampleIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Data Sample IRI not provided");
        }

        String templateDescUri = getTemplateDescUri(sparqlEndpointIri, dataSampleIri, namedGraph);
        String discoveryConfig = TtlGenerator.getDiscoveryConfig(List.of(new DataSource(templateDescUri)));
        return ResponseEntity.ok(discoveryService.startDiscoveryFromInput(discoveryConfig));
    }

    @NotNull
    private String getTemplateDescUri(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri, @NotNull String namedGraph) {
        String hostUri = Application.getConfig().getString("lpa.hostUrl");
        return new DefaultUriBuilderFactory()
                .uriString(hostUri + DataSourceController.TEMPLATE_DESCRIPTION_PATH)
                .queryParam(SPARQL_ENDPOINT_IRI_PARAM, sparqlEndpointIri)
                .queryParam(DATA_SAMPLE_IRI_PARAM, dataSampleIri)
                .queryParam(NAMED_GRAPH_PARAM, namedGraph)
                .build()
                .toString();
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