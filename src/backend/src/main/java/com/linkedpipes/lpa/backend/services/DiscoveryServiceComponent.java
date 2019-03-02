package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.database.DiscoveryRepository;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.rdf.vocabulary.SD;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import com.linkedpipes.lpa.backend.util.Streams;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RIOT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.DataInputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.concurrent.ScheduledFuture;
import org.springframework.beans.factory.annotation.Autowired;

import static java.util.concurrent.TimeUnit.*;
import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of Discovery-related backend operations of the application.
 */
@Service
public class DiscoveryServiceComponent implements DiscoveryService {

    private static final Logger logger = LoggerFactory.getLogger(DiscoveryServiceComponent.class);
    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper();

    private final ApplicationContext context;
    private final HttpActions httpActions = new HttpActions();

    @Autowired
    private DiscoveryRepository discoveryRepository;

    public DiscoveryServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Discovery startDiscoveryFromInput(String discoveryConfig) throws LpAppsException {
        String response = httpActions.startFromInput(discoveryConfig);
        Discovery result = OBJECT_MAPPER.readValue(response, Discovery.class);
        startStatusPolling(result.id);
        return result;
    }

    @Override
    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws LpAppsException {
        String response = httpActions.startFromInputIri(discoveryConfigIri);
        Discovery result = OBJECT_MAPPER.readValue(response, Discovery.class);
        startStatusPolling(result.id);
        return result;
    }

    public void startStatusPolling(String discoveryId) throws LpAppsException {
        Runnable checker = () -> {
            try {
                String status = httpActions.getStatus(discoveryId);
                DiscoveryStatus discoveryStatus = OBJECT_MAPPER.readValue(status, DiscoveryStatus.class);
                if (discoveryStatus.isFinished) {
                    logger.info("Reporting discovery finished in room " + discoveryId);
                    Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", status);
                    for (com.linkedpipes.lpa.backend.entities.database.Discovery d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                        d.setExecuting(false);
                    }

                    throw new RuntimeException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Crashed");
                throw new RuntimeException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, 10, 10, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", "Polling terminated");
            for (com.linkedpipes.lpa.backend.entities.database.Discovery d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                d.setExecuting(false);
            }
        };

        Application.SCHEDULER.schedule(canceller, 1, HOURS);
    }

    @Override
    public PipelineGroups getPipelineGroups(String discoveryId) throws LpAppsException {
        String response = httpActions.getPipelineGroups(discoveryId);

        PipelineGroups pipelineGroups = new PipelineGroups();

        ObjectNode jsonObject = OBJECT_MAPPER.readValue(response, ObjectNode.class);
        ObjectNode pipelineGroupsJson = (ObjectNode) jsonObject.get("pipelineGroups");
        ArrayNode appGroups = (ArrayNode) pipelineGroupsJson.get("applicationGroups");

        for (JsonNode appGroup : appGroups) {
            PipelineGroup pipelineGrp = new PipelineGroup();
            ObjectNode appGroupObj = (ObjectNode) appGroup;
            pipelineGrp.visualizer = OBJECT_MAPPER.convertValue(appGroupObj.get("applicationInstance"), ApplicationInstance.class);

            ArrayNode dataSourceGroups = (ArrayNode) appGroupObj.get("dataSourceGroups");

            for (JsonNode dataSourceGroup : dataSourceGroups) {
                DataSourceGroup dataSrcGroup = new DataSourceGroup();
                ArrayNode datasourceInstances = (ArrayNode) dataSourceGroup.get("dataSourceInstances");
                dataSrcGroup.dataSources = OBJECT_MAPPER.convertValue(datasourceInstances, new TypeReference<ArrayList<DataSource>>() {
                });

                ArrayNode extractorGroups = (ArrayNode) dataSourceGroup.get("extractorGroups");

                dataSrcGroup.pipelines = Streams.sequentialFromIterable(extractorGroups)
                        .map(obj -> (ArrayNode) obj.get("dataSampleGroups"))
                        .flatMap(Streams::sequentialFromIterable)
                        .map(node -> (ObjectNode) node)
                        .map(this::pipelineFromJson)
                        .collect(Collectors.toList());

                pipelineGrp.dataSourceGroups.add(dataSrcGroup);
            }
            pipelineGroups.pipelineGroups.add(pipelineGrp);
        }

        return pipelineGroups;
    }

    private Pipeline pipelineFromJson(ObjectNode node) {
        Pipeline pipeline = OBJECT_MAPPER.convertValue(node.get("pipeline"), Pipeline.class);
        pipeline.minimalIteration = node.get("minimalIteration").asInt();
        return pipeline;
    }

    @Override
    public PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException {
        String response = httpActions.exportPipeline(discoveryId, pipelineUri);
        return OBJECT_MAPPER.readValue(response, PipelineExportResult.class);
    }

    @Override
    public PipelineExportResult exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws LpAppsException {
        String exportResult = httpActions.exportPipelineUsingSD(discoveryId, pipelineUri, OBJECT_MAPPER.writeValueAsString(serviceDescription));
        return OBJECT_MAPPER.readValue(exportResult, PipelineExportResult.class);
    }

    @Override
    public String getVirtuosoServiceDescription(String graphName) {
        RIOT.init();

        // create an empty model
        Model model = ModelFactory.createDefaultModel();

        //read base rdf from resource
        InputStream fileStream = new DataInputStream(DiscoveryServiceComponent.class.getResourceAsStream("virtuoso_sd.ttl"));
        model.read(fileStream, "", "TURTLE");

        String virtuosoEndpoint = Application.getConfig().getString("lpa.virtuoso.crudEndpoint");

        //create triple ns1:service sd:namedGraph [sd:name <graphName>];
        //resource, property, RDFNode
        Resource endpoint = model.createResource(virtuosoEndpoint + "/service");
        Resource blankNode = model.createResource().addProperty(SD.name, model.createResource(graphName));
        model.add(endpoint, SD.namedGraph, blankNode);

        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);

        String serviceDescription = stringWriter.toString();
        logger.debug(String.format("Service description of our Virtuoso server for named graph <%s> is:\n%s", graphName, serviceDescription));
        return serviceDescription;
    }

    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString("lpa.discoveryServiceUrl");
        private final String URL_START_FROM_INPUT = urlFrom(URL_BASE, "discovery", "startFromInput");
        private final String URL_START_FROM_INPUT_IRI = urlFrom(URL_BASE, "discovery", "startFromInputIri");
        private final String URL_GET_STATUS = urlFrom(URL_BASE, "discovery", "%s");
        private final String URL_GET_PIPELINE_GROUPS = urlFrom(URL_BASE, "discovery", "%s", "pipeline-groups");
        private final String URL_EXPORT_PIPELINE = urlFrom(URL_BASE, "discovery", "%s", "export", "%s");

        private String startFromInput(String discoveryConfig) throws LpAppsException {
            return new HttpRequestSender(context).to(URL_START_FROM_INPUT)
                    .method(HttpRequestSender.HttpMethod.POST)
                    .requestBody(discoveryConfig)
                    .contentType("text/plain")
                    .acceptType("application/json")
                    .send();
        }

        private String startFromInputIri(String discoveryConfigIri) throws LpAppsException {
            return new HttpRequestSender(context).to(URL_START_FROM_INPUT_IRI)
                    .parameter("iri", discoveryConfigIri)
                    .acceptType("application/json")
                    .send();
        }

        private String getStatus(String discoveryId) throws LpAppsException {
            return new HttpRequestSender(context).to(String.format(URL_GET_STATUS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        private String getPipelineGroups(String discoveryId) throws LpAppsException {
            return new HttpRequestSender(context).to(String.format(URL_GET_PIPELINE_GROUPS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        private String exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException {
            return new HttpRequestSender(context).to(String.format(URL_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .acceptType("application/json")
                    .send();
        }

        private String exportPipelineUsingSD(String discoveryId, String pipelineUri, String serviceDescription) throws LpAppsException {
            return new HttpRequestSender(context).to(String.format(URL_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .method(HttpRequestSender.HttpMethod.POST)
                    .requestBody(serviceDescription)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

    }

}
