package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.Visualizers;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import com.linkedpipes.lpa.backend.util.Streams;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.stream.Collectors;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of Discovery-related backend operations of the application.
 */
@Service
public class DiscoveryServiceComponent implements DiscoveryService {

    private static final Logger logger = LoggerFactory.getLogger(DiscoveryServiceComponent.class);
    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper();
    public static final String OUR_DATASET_TEMPLATE_TITLE = "Unspecified user-provided dataset template";

    @NotNull private final ApplicationContext context;
    @NotNull private final HttpActions httpActions = new HttpActions();

    public DiscoveryServiceComponent(@NotNull ApplicationContext context) {
        this.context = context;
    }

    @NotNull @Override
    public Discovery startDiscoveryFromInput(@NotNull String discoveryConfig) throws LpAppsException {
        String response = httpActions.startFromInput(discoveryConfig);
        return OBJECT_MAPPER.readValue(response, Discovery.class);
    }

    @NotNull @Override
    public Discovery startDiscoveryFromInputIri(@NotNull String discoveryConfigIri) throws LpAppsException {
        String response = httpActions.startFromInputIri(discoveryConfigIri);
        return OBJECT_MAPPER.readValue(response, Discovery.class);
    }

    @NotNull @Override
    public DiscoveryStatus getDiscoveryStatus(@NotNull String discoveryId) throws LpAppsException {
        String status = httpActions.getStatus(discoveryId);
        return OBJECT_MAPPER.readValue(status, DiscoveryStatus.class);
    }

    @Override
    public PipelineGroups getPipelineGroups(String discoveryId) throws LpAppsException {
        logger.info("Get pipeline groups for discovery id: " + discoveryId);
        String response = httpActions.getPipelineGroups(discoveryId);

        PipelineGroups pipelineGroups = new PipelineGroups();

        ObjectNode jsonObject = OBJECT_MAPPER.readValue(response, ObjectNode.class);
        ObjectNode pipelineGroupsJson = (ObjectNode) jsonObject.get("pipelineGroups");
        ArrayNode appGroups = (ArrayNode) pipelineGroupsJson.get("applicationGroups");

        for (JsonNode appGroup : appGroups) {
            PipelineGroup pipelineGrp = new PipelineGroup();
            ObjectNode appGroupObj = (ObjectNode) appGroup;
            pipelineGrp.visualizer = OBJECT_MAPPER.convertValue(appGroupObj.get("applicationInstance"), ApplicationInstance.class);
            pipelineGrp.visualizer.visualizerCode = Visualizers.map.getOrDefault(pipelineGrp.visualizer.iri, "");

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

            for (DataSourceGroup dsg : pipelineGrp.dataSourceGroups) {
                for (DataSource ds : dsg.dataSources) {
                    if (ds.label.equals(OUR_DATASET_TEMPLATE_TITLE)) {
                        ds.label = "SPARQL endpoint -> " + pipelineGrp.visualizer.label;
                    }
                }
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
    public void cancelDiscovery(String discoveryId) throws LpAppsException {
        httpActions.stop(discoveryId);
    }

    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString("lpa.discoveryServiceUrl");
        private final String URL_START_FROM_INPUT = urlFrom(URL_BASE, "discovery", "startFromInput");
        private final String URL_START_FROM_INPUT_IRI = urlFrom(URL_BASE, "discovery", "startFromInputIri");
        private final String URL_GET_STATUS = urlFrom(URL_BASE, "discovery", "%s");
        private final String URL_GET_PIPELINE_GROUPS = urlFrom(URL_BASE, "discovery", "%s", "pipeline-groups");
        private final String URL_EXPORT_PIPELINE = urlFrom(URL_BASE, "discovery", "%s", "export", "%s");
        private final String URL_STOP = urlFrom(URL_BASE, "discovery", "%s", "stop");

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

        private void stop(String discoveryId) throws LpAppsException {
            logger.info("GET " + String.format(URL_STOP, discoveryId));
            new HttpRequestSender(context).to(String.format(URL_STOP, discoveryId))
                .method(HttpRequestSender.HttpMethod.GET)
                .send();
        }

    }

}
