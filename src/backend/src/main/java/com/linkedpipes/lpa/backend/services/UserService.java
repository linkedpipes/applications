package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.UserProfile;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;

import java.util.List;

public interface UserService {
    public UserProfile addUser(String user, String webId) throws UserTakenException;
    public UserProfile updateUser(String user, String webId) throws UserTakenException;
    public UserProfile getUserProfile(String user) throws UserNotFoundException;

    public void setUserDiscovery(String user, String discovery) throws UserNotFoundException;
    public List<Discovery> getUserDiscoveries(String user) throws UserNotFoundException;
    public void deleteUserDiscovery(String user, String discovery);

    public void setUserExecution(String user, String execution) throws UserNotFoundException;
    public List<Execution> getUserExecutions(String user) throws UserNotFoundException;
    public void deleteUserExecution(String user, String execution);
}
