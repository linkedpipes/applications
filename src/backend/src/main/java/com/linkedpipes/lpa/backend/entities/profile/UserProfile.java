package com.linkedpipes.lpa.backend.entities.profile;
import java.util.List;

public class UserProfile {
    public String webId, color;

    public List<DiscoverySession> discoverySessions;
    public List<PipelineExecution> pipelineExecutions;

}
