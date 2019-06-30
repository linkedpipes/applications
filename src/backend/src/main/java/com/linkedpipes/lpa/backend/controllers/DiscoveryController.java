package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.constants.SupportedRDFMimeTypes;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.PipelineGroups;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.services.*;
import com.linkedpipes.lpa.backend.util.UrlUtils;
import org.apache.jena.riot.Lang;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@Profile("!disableDB")
public class DiscoveryController {

    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final ExecutorService executorService;
    @NotNull private final UserService userService;

    public static final String SPARQL_ENDPOINT_IRI_PARAM = "sparqlEndpointIri";
    public static final String DATA_SAMPLE_IRI_PARAM = "dataSampleIri";
    public static final String NAMED_GRAPHS_PARAM = "namedGraphs";

    public DiscoveryController(ApplicationContext context) {
        discoveryService = context.getBean(DiscoveryService.class);
        executorService = context.getBean(ExecutorService.class);
        userService = context.getBean(UserService.class);
    }

    @NotNull
    @PostMapping("/api/pipelines/discoverFromDataSources")
    public ResponseEntity<Discovery> startDiscoveryFromDataSources(@NotNull @RequestParam("webId") String webId,
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
            Discovery newDiscovery = executorService.startDiscoveryFromConfig(discoveryConfig, webId);
            return ResponseEntity.ok(newDiscovery);
        } catch(UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    /**
     * Start discovery of pipelines from received RDF data
     * @param rdfFile main RDF data file
     * @param dataSampleFile data sample for main file
     * @param webId
     * @return
     * @throws LpAppsException
     */
    @NotNull
    @PostMapping("/api/pipelines/discoverFromInput")
    public ResponseEntity<Discovery> startDiscoveryFromInput(@NotNull @RequestParam("webId") String webId,
                                                             @RequestParam("rdfFile") MultipartFile rdfFile,
                                                             @Nullable @RequestParam(value="dataSampleFile", required=false) MultipartFile dataSampleFile) throws LpAppsException, IOException {
        if (rdfFile == null || rdfFile.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "RDF input not provided");
        }

        try {
            userService.addUserIfNotPresent(webId);
            return ResponseEntity.ok(executorService.startDiscoveryFromInputFiles(rdfFile, dataSampleFile, webId));

        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    /**
     * Start discovery of pipelines using data referenced by IRI
     * @param rdfFileIri IRI referencing a file with RDF data
     * @param dataSampleIri
     * @param webId
     * @return
     * @throws LpAppsException
     * @throws IOException reading RDF data from URI failed
     */
    @NotNull
    @PostMapping("/api/pipelines/discoverFromInputIri")
    public ResponseEntity<Discovery> startDiscoveryFromInputIri(@NotNull @RequestParam("webId") String webId,
                                                                @NotNull @RequestParam(value = "rdfInputIri") String rdfFileIri,
                                                                @NotNull @RequestParam(DATA_SAMPLE_IRI_PARAM) String dataSampleIri) throws LpAppsException, IOException {
        if (rdfFileIri == null || rdfFileIri.isEmpty()) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "RDF file IRI not provided");
        }

        try {
            userService.addUserIfNotPresent(webId);

            return ResponseEntity.ok(executorService.startDiscoveryFromInputIri(rdfFileIri, webId, dataSampleIri));

        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        } catch(MalformedURLException e){
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Invalid rdf input IRI", e);
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

            return ResponseEntity.ok(executorService.startDiscoveryFromEndpoint(webId, sparqlEndpointIri, dataSampleIri, namedGraphs));
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
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
