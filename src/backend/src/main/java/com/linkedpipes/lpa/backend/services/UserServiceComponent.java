package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Profile("!disableDB")
public class UserServiceComponent implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(DiscoveryServiceComponent.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    @Autowired
    private ExecutionRepository executionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Override
    public UserProfile addUser(String username, String webId) throws UserTakenException {
        try {
            getUser(username);
            throw new UserTakenException(username);
        } catch (UserNotFoundException e) {
            User user = new User();
            user.setUserName(username);
            user.setWebId(webId);
            repository.save(user);
            try {
                return getUserProfile(username);
            } catch(UserNotFoundException f) {
                logger.error("Failed to store user.");
                throw new RuntimeException(f);
            }
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

    private List<Execution> getExecutions(String username) throws UserNotFoundException {
        User user = getUser(username);
        return user.getExecutions();
    }

    @Override
    public void setUserExecution(String username, String executionIri) throws UserNotFoundException {
        User user = getUser(username);
        Execution e = new Execution();
        e.setExecutionStarted(executionIri);
        user.addExecution(e);
        executionRepository.save(e);
        repository.save(user);
    }

    @Override
    public List<com.linkedpipes.lpa.backend.entities.Execution> getUserExecutions(String username) throws UserNotFoundException {
        List<com.linkedpipes.lpa.backend.entities.Execution> executions = new ArrayList<>();
        for (Execution e : getExecutions(username)) {
            com.linkedpipes.lpa.backend.entities.Execution execution = new com.linkedpipes.lpa.backend.entities.Execution();
            execution.iri = e.getExecutionIri();
            executions.add(execution);
        }
        return executions;
    }

    @Override
    public void deleteUserExecution(String user, String executionIri) {
        Execution toDelete = null;
        try {
            for (Execution e : getExecutions(user)) {
                if (e.getExecutionIri().equals(executionIri)) {
                    toDelete = e;
                    break;
                }
            }

            if (null != toDelete) {
                executionRepository.delete(toDelete);
            } else {
                logger.warn("Execution not found: " + executionIri);
            }
        } catch (UserNotFoundException e) {
            logger.warn("User not found: " + user);
        }
    }

    @Override
    public UserProfile getUserProfile(String username) throws UserNotFoundException {
        User user = getUser(username);
        UserProfile profile = new UserProfile();
        profile.userId = user.getUserName();
        profile.webId = user.getWebId();

        profile.applications = new ArrayList<>();
        for (com.linkedpipes.lpa.backend.entities.database.Application dba : user.getApplications()) {
            com.linkedpipes.lpa.backend.entities.profile.Application app = new com.linkedpipes.lpa.backend.entities.profile.Application();
            app.solidIri = dba.getSolidIri();
            profile.applications.add(app);
        }

        profile.discoverySessions = new ArrayList<>();
        for (com.linkedpipes.lpa.backend.entities.database.Discovery d : user.getDiscoveries()) {
            DiscoverySession session = new DiscoverySession();
            session.id = d.getDiscoveryId();
            session.finished = !d.getExecuting();
            profile.discoverySessions.add(session);
        }

        profile.pipelineExecutions = new ArrayList<>();
        for (com.linkedpipes.lpa.backend.entities.database.Execution e : user.getExecutions()) {
            com.linkedpipes.lpa.backend.entities.profile.PipelineExecution exec = new com.linkedpipes.lpa.backend.entities.profile.PipelineExecution();
            exec.status = e.getStatus();
            exec.executionIri = e.getExecutionIri();
            exec.selectedVisualiser = e.getSelectedVisualiser();
            profile.pipelineExecutions.add(exec);
        }

        return profile;
    }

    @Override
    public UserProfile updateUser(String username, String webId) throws UserNotFoundException {
        User user = getUser(username);
        user.setWebId(webId);
        repository.save(user);
        return getUserProfile(username);
    }

    @Override
    public UserProfile addApplication(String username, String solidIri) throws UserNotFoundException {
        User user = getUser(username);
        com.linkedpipes.lpa.backend.entities.database.Application app = new com.linkedpipes.lpa.backend.entities.database.Application();
        app.setSolidIri(solidIri);
        user.addApplication(app);
        applicationRepository.save(app);
        repository.save(user);
        return getUserProfile(username);
    }

    @Override
    public UserProfile deleteApplication(String username, String solidIri) throws UserNotFoundException {
        User user = getUser(username);

        for (com.linkedpipes.lpa.backend.entities.database.Application app : user.getApplications()) {
            if (app.getSolidIri().equals(solidIri)) {
                applicationRepository.delete(app);
                break;
            }
        }

        return getUserProfile(username);
    }
}
