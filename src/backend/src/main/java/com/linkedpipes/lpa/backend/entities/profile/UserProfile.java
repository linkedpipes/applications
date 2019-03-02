package com.linkedpipes.lpa.backend.entities.profile;
import java.util.List;

public class UserProfile {
    public String userId, webId;

    public List<Application> applications;
    public List<DiscoverySession> discoverySessions;
    public List<PipelineExecution> pipelineExecutions;

}
