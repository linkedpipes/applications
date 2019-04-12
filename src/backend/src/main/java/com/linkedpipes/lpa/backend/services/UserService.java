package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;

import java.util.List;

public interface UserService {
    UserProfile addUserIfNotPresent(String user);
    void addApplication(String user, String solidIri) throws UserNotFoundException;
    void setUserDiscovery(String user, String discovery, String sparqlEndpointIri, String dataSampleIri, String namedGraph) throws UserNotFoundException;
    void setUserExecution(String user, String execution, String etlPipelineIri, String visualizer) throws UserNotFoundException;
}
