package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.database.ExecutionRepository;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.HttpRequestSender;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.concurrent.ScheduledFuture;
import java.text.SimpleDateFormat;
import java.util.Set;

import static java.util.concurrent.TimeUnit.*;
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

    @Autowired
    private ExecutionRepository executionRepository;

    public EtlServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Execution executePipeline(String etlPipelineIri) throws LpAppsException {
        String response = httpActions.executePipeline(etlPipelineIri);
        Execution execution = OBJECT_MAPPER.readValue(response, Execution.class);
        //TODO: make sure we insert the execution into the database (needs to be mapped on user though) and set executing to true
        startStatusPolling(execution.iri);
        return execution;
    }

    private void startStatusPolling(String executionIri) throws LpAppsException {
        Runnable checker = new Runnable() {
            @Override
            public void run() {
                try {
                    String response = httpActions.getExecutionStatus(executionIri);
                    ExecutionStatus executionStatus = OBJECT_MAPPER.readValue(response, ExecutionStatus.class);
                    if (executionStatus.status.isPollable()) {
                        Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", response);
                        for (com.linkedpipes.lpa.backend.entities.database.Execution e : executionRepository.findByExecutionIri(executionIri)) {
                            e.setExecuting(false);
                        }

                        throw new RuntimeException(); //this cancels the scheduler
                    }
                } catch (LpAppsException e) {
                    Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Crashed");
                    throw new RuntimeException(e); //this cancels the scheduler
                }
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, 10, 10, SECONDS);

        Runnable canceller = new Runnable() {
            @Override
            public void run() {
                checkerHandle.cancel(false);
                Application.SOCKET_IO_SERVER.getRoomOperations(executionIri).sendEvent("executionStatus", "Polling terminated");
                for (com.linkedpipes.lpa.backend.entities.database.Execution e : executionRepository.findByExecutionIri(executionIri)) {
                    e.setExecuting(false);
                }
            }
        };

        Application.SCHEDULER.schedule(canceller, 1, HOURS);
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
