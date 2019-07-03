package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;

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

    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString(ApplicationPropertyKeys.ETL_SERVICE_URL);
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
