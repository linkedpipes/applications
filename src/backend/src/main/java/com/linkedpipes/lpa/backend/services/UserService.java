package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;

import java.util.List;

public interface UserService {
    public void addUser(String user, String display) throws UserTakenException;
    public void setUserDiscovery(String user, String discovery) throws UserNotFoundException;
    public List<Discovery> getUserDiscoveries(String user) throws UserNotFoundException;
    public void deleteUserDiscovery(String user, String discovery);
}
