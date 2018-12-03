package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of ETL-related backend operations of the application.
 */
@Service
public class EtlServiceComponent implements EtlService {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .create();

    private static final Map<String, String> EXECUTION_STATUS = Map.of(
            "http://etl.linkedpipes.com/resources/status/failed", "FAILED",
            "http://etl.linkedpipes.com/resources/status/queued", "QUEUED",
            "http://etl.linkedpipes.com/resources/status/running", "RUNNING",
            "http://etl.linkedpipes.com/resources/status/finished", "FINISHED",
            "http://etl.linkedpipes.com/resources/status/cancelled", "CANCELLED",
            "http://etl.linkedpipes.com/resources/status/cancelling", "CANCELLING"
    );

    private final ApplicationContext context;
    private final HttpActions httpActions = new HttpActions();

    public EtlServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri) throws IOException {
        String response = httpActions.executePipeline(etlPipelineIri);
        return GSON.fromJson(response, Execution.class);
    }

    @Override
    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = httpActions.getExecutionStatus(executionIri);
        return GSON.fromJson(response, ExecutionStatus.class);
    }

    @Override
    public String getExecutionResult(String executionIri) throws IOException {
        return httpActions.getExecutionResult(executionIri);
    }

    private class HttpActions {

        private final String URL_BASE = Application.getConfig().getString("lpa.etlServiceUrl");
        private final String URL_EXECUTE_PIPELINE = urlFrom(URL_BASE, "executions");

        private String executePipeline(String pipelineIri) throws IOException {
            return new HttpRequestSender(context).to(URL_EXECUTE_PIPELINE)
                    .parameter("pipeline", pipelineIri)
                    .method(HttpRequestSender.HttpMethod.POST)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

        private String getExecutionStatus(String executionIri) throws IOException {
            String targetUrl = urlFrom(formatExecutionIri(executionIri), "overview");
            return new HttpRequestSender(context).to(targetUrl)
                    .acceptType("application/json")
                    .send();
        }

        private String getExecutionResult(String executionIri) throws IOException {
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
