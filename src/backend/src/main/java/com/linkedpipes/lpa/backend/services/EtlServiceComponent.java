package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.DataSamplePipelineInputGenerator;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.HttpFileUploader;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.text.SimpleDateFormat;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of ETL-related backend operations of the application.
 */
@Service
public class EtlServiceComponent implements EtlService {

    private static final Logger logger = LoggerFactory.getLogger(ExecutorServiceComponent.class);

    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper()
                    .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

    private static String dataSamplePipelineIri = Application.getConfig().getString(ApplicationPropertyKeys.DATA_SAMPLE_PIPELINE_IRI);

    private final ApplicationContext context;
    private final HttpActions httpActions = new HttpActions();

    public EtlServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri) throws LpAppsException {
        String response = httpActions.executePipeline(etlPipelineIri);
        return OBJECT_MAPPER.readValue(response, Execution.class);
    }

    @Override
    public ExecutionStatus getExecutionStatus(String executionIri) throws LpAppsException {
        String response = httpActions.getExecutionStatus(executionIri);
        ExecutionStatus executionStatus = OBJECT_MAPPER.readValue(response, ExecutionStatus.class);
        return executionStatus;
    }

    @Override
    public String getExecutionResult(String executionIri) throws LpAppsException {
        return httpActions.getExecutionResult(executionIri);
    }

    @Override
    public void cancelExecution(String executionIri) throws LpAppsException {
        httpActions.cancelExecution(executionIri);
    }

    @Override
    public Execution executeDataSamplePipeline(String sparqlEndpointIri, String namedGraph) throws LpAppsException {
         String transformed = DataSamplePipelineInputGenerator.getDataSamplePipeline(namedGraph, sparqlEndpointIri);
         logger.info("Data sample input:\n" + transformed);
         String response = httpActions.executeDataSamplePipeline(dataSamplePipelineIri, transformed);
         return OBJECT_MAPPER.readValue(response, Execution.class);
    }

    @PostConstruct
    public void uploadDataSamplePipeline() throws IOException, InterruptedException {
        logger.info("Waiting for ETL to start");
        while (true) {
            try {
                httpActions.getPipelines();
                break;
            } catch(LpAppsException e) {
                Thread.sleep(1000);
            }
        }
        logger.info("Uploading data sample pipeline to ETL");
        try {
            try (java.io.InputStream is = EtlServiceComponent.class.getResourceAsStream("datasample.jsonld")) {
                String sample = IOUtils.toString(is, java.nio.charset.StandardCharsets.UTF_8);
                String response = httpActions.createDataSamplePipeline(sample);
                dataSamplePipelineIri = response.substring(response.indexOf("<") + 1, response.indexOf(">"));
                logger.info("New data sample pipeline IRI: " + dataSamplePipelineIri);
            }
        } catch (LpAppsException e) {
            logger.error("Failed to upload data sample pipeline to ETL", e);
        }
    }

    @PreDestroy
    public void removeDataSamplePipeline() {
        logger.info("Deleting data sample pipeline");
        try {
            logger.debug(httpActions.deleteDataSamplePipeline(dataSamplePipelineIri));
        } catch (LpAppsException e) {
            logger.error("Failed to remove data sample pipeline from ETL, IRI was: " + dataSamplePipelineIri, e);
        }
    }


    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString(ApplicationPropertyKeys.ETL_SERVICE_URL);
        private final String URL_EXECUTE_PIPELINE = urlFrom(URL_BASE, "executions");
        private final String URL_CREATE_PIPELINE = urlFrom(URL_BASE, "pipelines");

        private String getPipelines() throws LpAppsException {
            return new HttpRequestSender(context).to(URL_CREATE_PIPELINE)
                .method(HttpRequestSender.HttpMethod.GET)
                .contentType("application/ld+json")
                .acceptType("application/ld+json")
                .send();
        }

        private String deleteDataSamplePipeline(String pipelineIri) throws LpAppsException {
            String pipelineId = StringUtils.substringAfterLast(pipelineIri, "/");
            String url = urlFrom(URL_CREATE_PIPELINE, pipelineId);
            return new HttpRequestSender(context).to(url)
                    .method(HttpRequestSender.HttpMethod.DELETE)
                    .send();
        }

        private String executeDataSamplePipeline(String pipelineIri, String data) throws LpAppsException {
            String url = URL_EXECUTE_PIPELINE + "?pipeline=" + pipelineIri;
            return new HttpFileUploader().uploadTTL(url, data, "input", "text/turtle");
        }

        private String createDataSamplePipeline(String definition) throws LpAppsException {
            return new HttpFileUploader().uploadTTL(URL_CREATE_PIPELINE, definition, "pipeline", "application/ld+json");
        }

        private String executePipeline(String pipelineIri) throws LpAppsException {
            return new HttpRequestSender(context).to(URL_EXECUTE_PIPELINE)
                    .parameter("pipeline", pipelineIri)
                    .method(HttpRequestSender.HttpMethod.POST)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

        private String getExecutionStatus(String executionIri) throws LpAppsException {
            String targetUrl = urlFrom(formatExecutionIri(executionIri), "overview");
            return new HttpRequestSender(context).to(targetUrl)
                    .acceptType("application/json")
                    .send();
        }

        private String getExecutionResult(String executionIri) throws LpAppsException {
            return new HttpRequestSender(context).to(formatExecutionIri(executionIri))
                    .acceptType("application/json")
                    .send();
        }

        private void cancelExecution(String executionIri) throws LpAppsException {
            //This is not 100% ideal, but simple cancel doesn't work
            new HttpRequestSender(context).to(formatCancelExecutionIri(executionIri))
                .method(HttpRequestSender.HttpMethod.DELETE).send();
        }

        // the below methods are used as a hack to change localhost reference to the name
        // of the etl container in docker
        private String formatExecutionIri(String executionIri) {
            String executionId = StringUtils.substringAfterLast(executionIri, "/");
            return URL_BASE + "/executions/" + executionId;
        }

        private String formatCancelExecutionIri(String executionIri) {
            String executionId = StringUtils.substringAfterLast(executionIri, "/");
            return URL_BASE + "/executions/" + executionId;
        }
    }

}
