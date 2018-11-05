package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.entities.PipelineExportResult;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.services.EtlServiceComponent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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
    public ResponseEntity<String> exportPipelineWithSD(@RequestParam(value = "discoveryId") String discoveryId, @RequestParam(value = "pipelineUri") String pipelineUri) throws IOException {
        ServiceDescription serviceDescription = new ServiceDescription("https://gist.githubusercontent.com/eghuro/5d6717d949a01852c2737a8493a3e87a/raw/sd.ttl");
        //"http://nginx/api/sd?endpoint=db:8890/&namedGraph=http://named.graph/resource/graph/" + discoveryId + "/" + pipelineId);
        String response = discoveryService.exportPipelineUsingSD(discoveryId, pipelineUri, serviceDescription);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/sd")
    public ResponseEntity<String> serviceDescription(@RequestParam(value="endpoint") String endpoint, @RequestParam(value="namedGraph") String namedGraph) {
        StringBuilder sb = new StringBuilder();
        sb.append("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix ns1: <");
        sb.append(endpoint);
        sb.append("> .\n@prefix sd: <http://www.w3.org/ns/sparql-service-description#> .\nns1:sparql rdf:type sd:Service ;\nsd:endpoint ns1:sparql ;\nsd:namedGraph [ sd:name <");
        sb.append(namedGraph);
        sb.append("> ];\nsd:feature  sd:DereferencesURIs , sd:UnionDefaultGraph .\n@prefix ns3:    <http://www.w3.org/ns/formats/> .\nns1:sparql  sd:resultFormat ns3:RDFa , ns3:SPARQL_Results_JSON , ns3:SPARQL_Results_XML , ns3:Turtle , ns3:N-Triples , ns3:N3 , ns3:RDF_XML , ns3:SPARQL_Results_CSV ;\nsd:supportedLanguage sd:SPARQL10Query ; sd:url  ns1:sparql .");
        return ResponseEntity.ok(sb.toString());
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
