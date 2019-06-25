package com.linkedpipes.lpa.backend.services;

public interface ScheduledExecutionService {
    void repeatExecution(long frequencyHours, boolean repeat, String executionIri, String userId, String selectedVisualiser);
    void stopScheduledExecution(boolean repeat, String executionIri);
    void stopScheduledExecution(String webId, String solidIri);
}
