package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.*;
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
    public UserProfile addUser(String webId) throws UserTakenException {
        try {
            getUser(webId);
            throw new UserTakenException(webId);
        } catch (UserNotFoundException e) {
            UserDao user = new UserDao();
            user.setWebId(webId);
            repository.save(user);
            try {
                return getUserProfile(webId);
            } catch(UserNotFoundException f) {
                logger.error("Failed to store user.");
                throw new RuntimeException(f);
            }
        }
    }

    @Override
    public void setUserDiscovery(String username, String discoveryId) throws UserNotFoundException {
        UserDao user = getUser(username);
        DiscoveryDao d = new DiscoveryDao();
        d.setDiscoveryStarted(discoveryId, new Date());
        user.addDiscovery(d);
        discoveryRepository.save(d);
        repository.save(user);
    }

    @Override
    public List<Discovery> getUserDiscoveries(String username) throws UserNotFoundException {
        List<Discovery> discoveries = new ArrayList<>();
        for (DiscoveryDao d : getDiscoveries(username)) {
            Discovery discovery = new Discovery();
            discovery.id = d.getDiscoveryId();
            discoveries.add(discovery);
        }
        return discoveries;
    }

    private List<DiscoveryDao> getDiscoveries(String username) throws UserNotFoundException {
        UserDao user = getUser(username);
        return user.getDiscoveries();
    }

    private UserDao getUser(String username) throws UserNotFoundException {
        List<UserDao> users = repository.findByWebId(username);
        UserDao user;
        if (users.size() == 0) throw new UserNotFoundException(username);
        if (users.size() > 1) {
            logger.warn("Got multiple users with username: " + username);
        }
        user = users.get(0);
        return user;
    }

    @Override
    public void deleteUserDiscovery(String user, String discoveryId) {
        DiscoveryDao toDelete = null;
        try {
            for (DiscoveryDao d : getDiscoveries(user)) {
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

    private List<ExecutionDao> getExecutions(String username) throws UserNotFoundException {
        UserDao user = getUser(username);
        return user.getExecutions();
    }

    @Override
    public void setUserExecution(String username, String executionIri, String selectedVisualiser) throws UserNotFoundException {
        UserDao user = getUser(username);
        ExecutionDao e = new ExecutionDao();
        e.setExecutionStarted(executionIri);
        e.setSelectedVisualiser(selectedVisualiser);
        user.addExecution(e);
        executionRepository.save(e);
        repository.save(user);
    }

    @Override
    public List<Execution> getUserExecutions(String username) throws UserNotFoundException {
        List<Execution> executions = new ArrayList<>();
        for (ExecutionDao e : getExecutions(username)) {
            Execution execution = new Execution();
            execution.iri = e.getExecutionIri();
            executions.add(execution);
        }
        return executions;
    }

    @Override
    public void deleteUserExecution(String user, String executionIri) {
        ExecutionDao toDelete = null;
        try {
            for (ExecutionDao e : getExecutions(user)) {
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
        UserDao user = getUser(username);
        UserProfile profile = new UserProfile();
        profile.webId = user.getWebId();

        profile.applications = new ArrayList<>();
        for (ApplicationDao dba : user.getApplications()) {
            Application app = new Application();
            app.solidIri = dba.getSolidIri();
            profile.applications.add(app);
        }

        profile.discoverySessions = new ArrayList<>();
        for (DiscoveryDao d : user.getDiscoveries()) {
            DiscoverySession session = new DiscoverySession();
            session.id = d.getDiscoveryId();
            session.finished = !d.getExecuting();
            profile.discoverySessions.add(session);
        }

        profile.pipelineExecutions = new ArrayList<>();
        for (ExecutionDao e : user.getExecutions()) {
            PipelineExecution exec = new PipelineExecution();
            exec.status = e.getStatus();
            exec.executionIri = e.getExecutionIri();
            exec.selectedVisualiser = e.getSelectedVisualiser();
            profile.pipelineExecutions.add(exec);
        }

        return profile;
    }

    @Override
    public UserProfile addApplication(String username, String solidIri) throws UserNotFoundException {
        UserDao user = getUser(username);
        ApplicationDao app = new ApplicationDao();
        app.setSolidIri(solidIri);
        user.addApplication(app);
        applicationRepository.save(app);
        repository.save(user);
        return getUserProfile(username);
    }

    @Override
    public UserProfile deleteApplication(String username, String solidIri) throws UserNotFoundException {
        UserDao user = getUser(username);

        for (ApplicationDao app : user.getApplications()) {
            if (app.getSolidIri().equals(solidIri)) {
                applicationRepository.delete(app);
                break;
            }
        }

        return getUserProfile(username);
    }
}
