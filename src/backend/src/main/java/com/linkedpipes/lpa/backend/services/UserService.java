package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;

import java.util.List;

public interface UserService {
    public void addUser(String user, String display) throws UserTakenException;

    public void setUserDiscovery(String user, String discovery) throws UserNotFoundException;
    public List<Discovery> getUserDiscoveries(String user) throws UserNotFoundException;
    public void deleteUserDiscovery(String user, String discovery);

    public void setUserExecution(String user, String execution) throws UserNotFoundException;
    public List<Execution> getUserExecutions(String user) throws UserNotFoundException;
    public void deleteUserExecution(String user, String execution);
}
