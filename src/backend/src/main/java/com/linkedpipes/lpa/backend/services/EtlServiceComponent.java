package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.io.IOException;
import java.text.ParseException;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

/**
 * Provides the functionality of ETL-related backend operations of the application.
 */
@Service
public class EtlServiceComponent implements EtlService {

    private static final Logger logger = LoggerFactory.getLogger(ExecutorServiceComponent.class);

    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper()
                    .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

    private final ApplicationContext context;
    private final HttpActions httpActions = new HttpActions();

    public EtlServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri) throws LpAppsException {
        String response = httpActions.executePipeline(etlPipelineIri);
        Execution execution = OBJECT_MAPPER.readValue(response, Execution.class);
        return execution;
    }

    @Override
    public ExecutionStatus getExecutionStatus(String executionIri) throws LpAppsException {
        String response = httpActions.getExecutionStatus(executionIri);
        logger.error("ETL status response: " + response);

        //construct a subset of status we need
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
            ObjectMapper mapper = new ObjectMapper();
            Date started = format.parse(mapper.readTree(response).get("executionStarted").asText());
            Date finished = format.parse(mapper.readTree(response).get("executionFinished").asText());
            EtlStatus status = EtlStatus.fromIri(mapper.readTree(response).get("status").get("@id").asText());

            logger.error("ETL status IRI: " + status.getStatusIri() + "(pollable: " + (status.isPollable() ? "Yes" : "No") + ")");

            ExecutionStatus executionStatus = new ExecutionStatus();
            executionStatus.status = status;
            executionStatus.started = started;
            executionStatus.finished = finished;

            return executionStatus;
        } catch(IOException | ParseException e) {
            logger.error("Failed to parse ETL status: " + response);
            throw new LpAppsException(INTERNAL_SERVER_ERROR, "Failed to parse ETL status response", e);
        }
    }

    @Override
    public String getExecutionResult(String executionIri) throws LpAppsException {
        return httpActions.getExecutionResult(executionIri);
    }

    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString("lpa.etlServiceUrl");
        private final String URL_EXECUTE_PIPELINE = urlFrom(URL_BASE, "executions");

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

        // the below method is used as a hack to change localhost reference to the name
        // of the etl container in docker
        private String formatExecutionIri(String executionIri) {
            String executionId = StringUtils.substringAfterLast(executionIri, "/");
            return URL_BASE + "/executions/" + executionId;
        }
    }

}
