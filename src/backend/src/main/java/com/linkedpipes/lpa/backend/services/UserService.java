package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;

import java.util.List;

public interface UserService {
    UserProfile addUser(String user) throws UserTakenException;
    UserProfile getUserProfile(String user) throws UserNotFoundException;
    UserProfile addUserIfNotPresent(String user);

    UserProfile addApplication(String user, String solidIri) throws UserNotFoundException;
    UserProfile deleteApplication(String user, String solidIri) throws UserNotFoundException;

    void setUserDiscovery(String user, String discovery, String sparqlEndpointIri, String dataSampleIri, String namedGraph) throws UserNotFoundException;
    List<Discovery> getUserDiscoveries(String user) throws UserNotFoundException;
    void deleteUserDiscovery(String user, String discovery);

    void setUserExecution(String user, String execution, String etlPipelineIri, String visualizer) throws UserNotFoundException;
    List<Execution> getUserExecutions(String user) throws UserNotFoundException;
    void deleteUserExecution(String user, String execution);
}
