package com.linkedpipes.lpa.backend.controllers;

import com.google.gson.Gson;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.HttpUrlConnector;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RIOT;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.RDF;
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

        //TODO move below logic to a service class
        //TODO the ttl config being generated isn't valid, fix
        RIOT.init() ;

        // create an empty model
        Model model = ModelFactory.createDefaultModel();

        // create the resources
        for (DataSource dataSource : dataSourceList) {
            Resource res = model.createResource(dataSource.Uri);

            // TODO : Refactor below, not sure about correct implementation
            model.add(res, RDF.type, FOAF.page);
        }

        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        String discoveryConfig = stringWriter.toString();

        String response =  httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                discoveryConfig, "text/plain", "application/json");
        Discovery newDiscovery = new Gson().fromJson(response, Discovery.class);

        return ResponseEntity.ok(newDiscovery);
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public ResponseEntity<?> startDiscoveryFromInput(@RequestBody String discoveryConfig) throws IOException{
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return new ResponseEntity(new ErrorResponse("Discovery config not provided"), HttpStatus.BAD_REQUEST);
        }

        String response =  httpUrlConnector.sendPostRequest(Application.config.getProperty("discoveryServiceUrl") + "/discovery/startFromInput",
                discoveryConfig, "text/plain", "application/json");
        Discovery newDiscovery = new Gson().fromJson(response, Discovery.class);

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