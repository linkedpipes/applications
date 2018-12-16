package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.interfaces.IDiscoveryService;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.Streams;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.impl.PropertyImpl;
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
import java.util.ArrayList;
import java.util.stream.Collectors;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of Discovery-related backend operations of the application.
 */
@Service
public class DiscoveryService implements IDiscoveryService {

    private static final Logger logger = LoggerFactory.getLogger(DiscoveryService.class);
    private static final Gson DEFAULT_GSON = new Gson();

    private final ApplicationContext context;
    private final HttpActions httpActions = new HttpActions();

    public DiscoveryService(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Discovery startDiscoveryFromInput(String discoveryConfig) throws LpAppsException {
        String response = httpActions.startFromInput(discoveryConfig);
        return DEFAULT_GSON.fromJson(response, Discovery.class);
    }

    @Override
    public Discovery startDiscoveryFromInputIri(String discoveryConfigIri) throws LpAppsException {
        String response = httpActions.startFromInputIri(discoveryConfigIri);
        return DEFAULT_GSON.fromJson(response, Discovery.class);
    }

    // TODO strongly type below method params (not simply string)
    @Override
    public String getDiscoveryStatus(String discoveryId) throws LpAppsException{
        return httpActions.getStatus(discoveryId);
    }

    @Override
    public PipelineGroups getPipelineGroups(String discoveryId) throws LpAppsException {
        String response = httpActions.getPipelineGroups(discoveryId);

        PipelineGroups pipelineGroups = new PipelineGroups();

        JsonObject jsonObject = DEFAULT_GSON.fromJson(response, JsonObject.class);
        JsonObject pipelineGroupsJson = jsonObject.getAsJsonObject("pipelineGroups");
        JsonArray appGroups = pipelineGroupsJson.getAsJsonArray("applicationGroups");

        for (JsonElement appGroup : appGroups) {
            PipelineGroup pipelineGrp = new PipelineGroup();
            JsonObject appGroupObj = appGroup.getAsJsonObject();
            pipelineGrp.visualizer = DEFAULT_GSON.fromJson(appGroupObj.getAsJsonObject("applicationInstance"), ApplicationInstance.class);

            JsonArray dataSourceGroups = appGroupObj.getAsJsonArray("dataSourceGroups");

            for (JsonElement dataSourceGroup : dataSourceGroups) {
                DataSourceGroup dataSrcGroup = new DataSourceGroup();
                JsonArray datasourceInstances = dataSourceGroup.getAsJsonObject().getAsJsonArray("dataSourceInstances");
                dataSrcGroup.dataSources = DEFAULT_GSON.fromJson(datasourceInstances, new TypeToken<ArrayList<DataSource>>() {
                }.getType());

                JsonArray extractorGroups = dataSourceGroup.getAsJsonObject().getAsJsonArray("extractorGroups");

                dataSrcGroup.pipelines = Streams.sequentialFromIterable(extractorGroups)
                        .map(JsonElement::getAsJsonObject)
                        .map(obj -> obj.getAsJsonArray("dataSampleGroups"))
                        .flatMap(Streams::sequentialFromIterable)
                        .map(JsonElement::getAsJsonObject)
                        .map(this::pipelineFromJson)
                        .collect(Collectors.toList());

                pipelineGrp.dataSourceGroups.add(dataSrcGroup);
            }
            pipelineGroups.pipelineGroups.add(pipelineGrp);
        }

        return pipelineGroups;
    }

    private Pipeline pipelineFromJson(JsonObject jsonObject) {
        Pipeline pipeline = DEFAULT_GSON.fromJson(jsonObject.getAsJsonObject("pipeline"), Pipeline.class);
        pipeline.minimalIteration = Integer.parseInt(jsonObject.getAsJsonPrimitive("minimalIteration").toString());
        return pipeline;
    }

    @Override
    public PipelineExportResult exportPipeline(String discoveryId, String pipelineUri) throws LpAppsException {
        String response = httpActions.exportPipeline(discoveryId, pipelineUri);
        return DEFAULT_GSON.fromJson(response, PipelineExportResult.class);
    }

    @Override
    public PipelineExportResult exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws LpAppsException {
        String exportResult = httpActions.exportPipelineUsingSD(discoveryId, pipelineUri, DEFAULT_GSON.toJson(serviceDescription));
        return DEFAULT_GSON.fromJson(exportResult, PipelineExportResult.class);
    }

    @Override
    public String getVirtuosoServiceDescription(String graphName) {
        RIOT.init();

        // create an empty model
        Model model = ModelFactory.createDefaultModel();

        //read base rdf from resource
        InputStream fileStream = new DataInputStream(DiscoveryService.class.getResourceAsStream("virtuoso_sd.ttl"));
        model.read(fileStream, "", "TURTLE");

        String virtuosoEndpoint = Application.getConfig().getString("lpa.virtuoso.crudEndpoint");
        String sd = "http://www.w3.org/ns/sparql-service-description#";

        //create triple ns1:service sd:namedGraph [sd:name <graphName>];
        //resource, property, RDFNode
        Resource endpoint = model.createResource(virtuosoEndpoint + "/service");
        Resource blankNode = model.createResource().addProperty(new PropertyImpl(sd + "name"), model.createResource(graphName));
        Statement name = model.createStatement(endpoint,
                                               new PropertyImpl(sd + "namedGraph"),
                                               blankNode);
        model.add(name);

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
