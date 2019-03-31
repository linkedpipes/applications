package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
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

    @NotNull @Override
    public UserProfile addUser(@NotNull String webId) throws UserTakenException {
        try {
            getUser(webId);
            throw new UserTakenException(webId);
        } catch (UserNotFoundException e) {
            return addNewUser(webId);
        }
    }

    private UserProfile addNewUser(String webId) {
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

    @NotNull @Override
    public UserProfile addUserIfNotPresent(String webId) {
        try {
            return getUserProfile(webId);
        } catch (UserNotFoundException e) {
            return addNewUser(webId);
        }
    }

    @NotNull @Override
    public void setUserDiscovery(@NotNull String username, @NotNull String discoveryId, @Nullable String sparqlEndpointIri, @Nullable String dataSampleIri, @Nullable String namedGraph) throws UserNotFoundException {
        UserDao user = getUser(username);
        DiscoveryDao d = new DiscoveryDao();
        d.setDiscoveryStarted(discoveryId, new Date());
        d.setSparqlEndpointIri(sparqlEndpointIri);
        d.setDataSampleIri(dataSampleIri);
        d.setNamedGraph(namedGraph);
        user.addDiscovery(d);
        discoveryRepository.save(d);
        repository.save(user);
    }

    @NotNull @Override
    public List<Discovery> getUserDiscoveries(@NotNull String username) throws UserNotFoundException {
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
        logger.info("Find " + username + " by web ID");
        List<UserDao> users = repository.findByWebId(username);
        UserDao user;
        if (users.size() == 0) {
            logger.info("Not found");
            throw new UserNotFoundException(username);
        }
        if (users.size() > 1) {
            logger.warn("Got multiple users with username: " + username);
        }

        logger.info("Got him");
        user = users.get(0);
        return user;
    }

    @Override
    public void deleteUserDiscovery(@NotNull String user, @NotNull String discoveryId) {
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

    @NotNull @Override
    public void setUserExecution(@NotNull String username, @NotNull String executionIri, String selectedVisualiser) throws UserNotFoundException {
        UserDao user = getUser(username);
        ExecutionDao e = new ExecutionDao();
        e.setExecutionStarted(executionIri);
        e.setSelectedVisualiser(selectedVisualiser);
        e.setStarted(new Date());
        user.addExecution(e);
        executionRepository.save(e);
        repository.save(user);
    }

    @NotNull @Override
    public List<Execution> getUserExecutions(@NotNull String username) throws UserNotFoundException {
        List<Execution> executions = new ArrayList<>();
        for (ExecutionDao e : getExecutions(username)) {
            Execution execution = new Execution();
            execution.iri = e.getExecutionIri();
            executions.add(execution);
        }
        return executions;
    }

    @NotNull @Override
    public void deleteUserExecution(@NotNull String user, @NotNull String executionIri) {
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

    @NotNull @Override
    public UserProfile getUserProfile(@NotNull String username) throws UserNotFoundException {
        UserDao user = getUser(username);
        if (user == null) throw new UserNotFoundException(username);
        UserProfile profile = new UserProfile();
        profile.webId = user.getWebId();
        profile.applications = new ArrayList<>();
        if (user.getApplications() != null) {
            for (ApplicationDao dba : user.getApplications()) {
                Application app = new Application();
                app.solidIri = dba.getSolidIri();
                profile.applications.add(app);
            }
        }

        profile.discoverySessions = new ArrayList<>();
        if (user.getDiscoveries() != null) {
            for (DiscoveryDao d : user.getDiscoveries()) {
                DiscoverySession session = new DiscoverySession();
                session.id = d.getDiscoveryId();
                session.finished = !d.getExecuting();
                session.start = d.getStarted().getTime() / 1000L;
                if (d.getFinished() != null) {
                    session.stop = d.getFinished().getTime() / 1000L;
                } else {
                    session.stop = -1;
                }
                session.sparqlEndpointIri = d.getSparqlEndpointIri();
                session.dataSampleIri = d.getDataSampleIri();
                session.namedGraph = d.getNamedGraph();
                profile.discoverySessions.add(session);
            }
        }

        profile.pipelineExecutions = new ArrayList<>();
        if (user.getExecutions() != null) {
            for (ExecutionDao e : user.getExecutions()) {
                PipelineExecution exec = new PipelineExecution();
                exec.status = e.getStatus();
                exec.executionIri = e.getExecutionIri();
                exec.selectedVisualiser = e.getSelectedVisualiser();
                exec.start = e.getStarted().getTime() / 1000L;
                exec.stop = e.getFinished().getTime() / 1000L;
                profile.pipelineExecutions.add(exec);
            }
        }

        return profile;
    }

    @NotNull @Override
    public UserProfile addApplication(@NotNull String username, @NotNull String solidIri) throws UserNotFoundException {
        UserDao user = getUser(username);
        ApplicationDao app = new ApplicationDao();
        app.setSolidIri(solidIri);
        user.addApplication(app);
        applicationRepository.save(app);
        repository.save(user);
        return getUserProfile(username);
    }

    @NotNull @Override
    public UserProfile deleteApplication(@NotNull String username, @NotNull String solidIri) throws UserNotFoundException {
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
