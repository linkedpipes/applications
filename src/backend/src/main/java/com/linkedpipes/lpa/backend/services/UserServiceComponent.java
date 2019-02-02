package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;


import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceComponent implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(DiscoveryServiceComponent.class);

    private final ApplicationContext context;

    @Autowired
    private UserRepository repository;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    public UserServiceComponent(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public void addUser(String username, String displayName) throws UserTakenException {
        try {
            User u = getUser(username);
            throw new UserTakenException(username);
        } catch (UserNotFoundException e) {
            User user = new User();
            user.setUserName(username);
            user.setDisplayName(displayName);
            repository.save(user);
        }
    }

    @Override
    public void setUserDiscovery(String username, String discoveryId) throws UserNotFoundException {
        User user = getUser(username);
        Discovery d = new Discovery();
        d.setDiscoveryStarted(discoveryId, new Date());
        user.addDiscovery(d);
        discoveryRepository.save(d);
        repository.save(user);
    }

    @Override
    public List<com.linkedpipes.lpa.backend.entities.Discovery> getUserDiscoveries(String username) throws UserNotFoundException {
        List<com.linkedpipes.lpa.backend.entities.Discovery> discoveries = new ArrayList<>();
        for (Discovery d : getDiscoveries(username)) {
            com.linkedpipes.lpa.backend.entities.Discovery discovery = new com.linkedpipes.lpa.backend.entities.Discovery();
            discovery.id = d.getDiscoveryId();
            discoveries.add(discovery);
        }
        return discoveries;
    }

    private List<Discovery> getDiscoveries(String username) throws UserNotFoundException {
        User user = getUser(username);
        return user.getDiscoveries();
    }

    private User getUser(String username) throws UserNotFoundException {
        List<User> users = repository.findByUserName(username);
        User user;
        if (users.size() == 0) throw new UserNotFoundException(username);
        if (users.size() > 1) {
            logger.warn("Got multiple users with username: " + username);
        }
        user = users.get(0);
        return user;
    }

    @Override
    public void deleteUserDiscovery(String user, String discoveryId) {
        Discovery toDelete = null;
        try {
            for (Discovery d : getDiscoveries(user)) {
                logger.info("Discovery: " + d.getDiscoveryId() + " (lookup = " + discoveryId + ")");
                if (d.getDiscoveryId().equals(discoveryId)) {
                    toDelete = d;
                    break;
                }
            }

            if (null != toDelete) {
                discoveryRepository.delete(toDelete);
            } else {
                logger.warn("Discovery not found: " + discoveryId);
            }
        } catch (UserNotFoundException e) {
            logger.warn("User not found: " + user);
        }
    }
}
