package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;

import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.services.virtuoso.VirtuosoService;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.PollingCompletedException;

import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationContext;
import java.util.concurrent.ScheduledFuture;
import java.util.List;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.Temporal;
import java.time.ZoneId;
import java.time.Instant;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.concurrent.TimeUnit.*;

@Service
@Profile("!disableDB")
public class ScheduledExecutionServiceComponent implements ScheduledExecutionService {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledExecutionServiceComponent.class);

    @Autowired
    private ExecutionRepository executionRepository;

    @Autowired
    private UserRepository userRepository;

    @NotNull private final ExecutorService executorService;
    @NotNull private final VirtuosoService virtuosoService;

    public ScheduledExecutionServiceComponent(ApplicationContext context) {
        this.executorService = context.getBean(ExecutorService.class);
        this.virtuosoService = context.getBean(VirtuosoService.class);
    }

    @Override
    public void stopScheduledExecution(String webId, String solidIri) {
        List<UserDao> users = userRepository.findByWebId(webId);
        if (users.size() > 0) {
            UserDao user = users.get(0);

            for (ApplicationDao app : user.getApplications()) {
                if (app.getSolidIri().equals(solidIri)) {
                    ExecutionDao execution = app.getExecution();
                    if (null != execution) {
                        //stop repeated executions
                        stopScheduledExecution(false, execution.getExecutionIri());
                    }
                }
            }
        }
    }

    @Override
    public void repeatExecution(@NotNull long frequencyHours, @NotNull boolean repeat, @NotNull String executionIri, @NotNull String userId, @NotNull String selectedVisualiser) {
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            e.setScheduled(repeat);
            e.setFrequencyHours(frequencyHours);
            executionRepository.save(e);
        }

        scheduleRepeatedExecution(frequencyHours, executionIri, userId, selectedVisualiser, frequencyHours);
    }

    @Override
    public void stopScheduledExecution(@NotNull boolean repeat, @NotNull String executionIri) {
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            e.setScheduled(repeat);
            executionRepository.save(e);
        }
    }

    private void scheduleRepeatedExecution(@NotNull long frequencyHours, @NotNull String executionIri, @NotNull String userId, @NotNull String selectedVisualiser, long initialDelay) {
        Runnable executor = () -> {
            try {
                for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                    if (!e.isScheduled()){
                        throw new PollingCompletedException();
                    } else {
                        virtuosoService.deleteNamedGraph(e.getPipeline().getResultGraphIri());
                        executorService.executePipeline(e.getPipeline().getEtlPipelineIri(), userId, selectedVisualiser, false);
                    }
                }
            } catch (LpAppsException e) {
                //something went wrong this time, will retry next iteration
            } catch (UserNotFoundException f) {
                throw new PollingCompletedException(f);
            }
        };

        Application.SCHEDULER.scheduleAtFixedRate(executor, initialDelay, frequencyHours, HOURS);
    }

    @PostConstruct
    public void startRepeatedExecutionsOnBoot() {
        logger.info("Scheduling repeated executions");
        LocalDateTime now = Instant.now().atZone(ZoneId.systemDefault()).toLocalDateTime();

        for (ExecutionDao e : executionRepository.findByScheduled(true)) {
            logger.debug(e.getExecutionIri());

            long initialDelay = 0;
            if (e.getFinished() != null) {
                LocalDateTime finished = e.getFinished().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                Temporal nextScheduledRun = finished.plusHours(e.getFrequencyHours());
                Duration d = Duration.between(now, nextScheduledRun);
                if (!d.isZero() && !d.isNegative()) {
                    initialDelay = d.toHours();
                }
            }

            scheduleRepeatedExecution(
                e.getFrequencyHours(),
                e.getExecutionIri(),
                e.getUser().getWebId(),
                e.getSelectedVisualiser(),
                initialDelay
            );
        }
        logger.info("Done");
    }
}
