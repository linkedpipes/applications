package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.util.Map;

import static com.linkedpipes.lpa.backend.util.UrlUtils.urlFrom;

/**
 * Provides the functionality of ETL-related backend operations of the application.
 */
public class EtlServiceComponent {

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

    public Execution executePipeline(String etlPipelineIri) throws IOException {
        String response = HttpActions.executePipeline(etlPipelineIri);
        return GSON.fromJson(response, Execution.class);
    }

    public ExecutionStatus getExecutionStatus(String executionIri) throws IOException {
        String response = HttpActions.getExecutionStatus(executionIri);
        return GSON.fromJson(response, ExecutionStatus.class);
    }

    public String getExecutionResult(String executionIri) throws IOException {
        return HttpActions.getExecutionResult(executionIri);
    }

    private static class HttpActions {

        private static final String URL_BASE = Application.getConfig().getString("lpa.etlServiceUrl");
        private static final String URL_EXECUTE_PIPELINE = urlFrom(URL_BASE, "executions");

        private static String executePipeline(String pipelineIri) throws IOException {
            return new HttpRequestSender().to(URL_EXECUTE_PIPELINE)
                    .parameter("pipeline", pipelineIri)
                    .method(HttpRequestSender.HttpMethod.POST)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

        private static String getExecutionStatus(String executionIri) throws IOException {
            String targetUrl = urlFrom(formatExecutionIri(executionIri), "overview");
            return new HttpRequestSender().to(targetUrl)
                    .acceptType("application/json")
                    .send();
        }

        private static String getExecutionResult(String executionIri) throws IOException {
            return new HttpRequestSender().to(formatExecutionIri(executionIri))
                    .acceptType("application/json")
                    .send();
        }

        //the below method is used as a hack to change localhost reference to the name of the etl container in docker
        private static String formatExecutionIri(String executionIri){
            String exeuctionId = StringUtils.substringAfterLast(executionIri, "/");
            return URL_BASE + "/executions/" + exeuctionId;
        }
    }

}
