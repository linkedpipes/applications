package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import java.text.SimpleDateFormat;
import java.util.Set;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of ETL-related backend operations of the application.
 */
@Service
public class EtlServiceComponent implements EtlService {

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
        return OBJECT_MAPPER.readValue(response, ExecutionStatus.class);
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
