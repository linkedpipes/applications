package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.text.SimpleDateFormat;

@Service
@Profile("!disableDB")
public class UserServiceComponent implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(DiscoveryServiceComponent.class);
    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper()
                    .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

    @Autowired
    private UserRepository repository;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    @Autowired
    private ExecutionRepository executionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PipelineInformationRepository pipelineRepository;

    @NotNull @Override @Transactional(isolation = Isolation.SERIALIZABLE)
    public UserProfile addUserIfNotPresent(String webId) {
        List<UserDao> users = repository.findByWebId(webId);
        if (users.size() > 0) {
            return transformUserProfile(users.get(0));
        } else {
            UserDao user = new UserDao();
            user.setWebId(webId);
            repository.save(user);

            UserProfile profile = transformUserProfile(user);
            return profile;
        }
    }

    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
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

    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public void setUserExecution(@NotNull String username, @NotNull String executionIri, @NotNull String etlPipelineIri, String selectedVisualiser) throws UserNotFoundException {
        UserDao user = getUser(username);
        List<PipelineInformationDao> pipelines = pipelineRepository.findByEtlPipelineIri(etlPipelineIri);
        ExecutionDao e = new ExecutionDao();
        e.setExecutionStarted(executionIri);
        if (pipelines.size() > 0) {
            e.setPipeline(pipelines.get(0));
        } else {
            logger.error("Pipeline information not found: " + etlPipelineIri);
        }
        e.setSelectedVisualiser(selectedVisualiser);
        e.setStarted(new Date());
        user.addExecution(e);
        executionRepository.save(e);
        repository.save(user);
    }

    private UserProfile transformUserProfile(final UserDao user) {
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
                exec.etlPipelineIri = e.getPipeline().getEtlPipelineIri();
                exec.selectedVisualiser = e.getSelectedVisualiser();
                exec.start = e.getStarted().getTime() / 1000L;
                if (e.getFinished() != null) {
                    exec.stop = e.getFinished().getTime() / 1000L;
                } else {
                    exec.stop = -1;
                }
                profile.pipelineExecutions.add(exec);
            }
        }

        return profile;
    }

    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile addApplication(@NotNull String username, @NotNull String solidIri) throws UserNotFoundException, LpAppsException {
        UserDao user = getUser(username);
        ApplicationDao app = new ApplicationDao();
        app.setSolidIri(solidIri);
        user.addApplication(app);
        applicationRepository.save(app);
        repository.save(user);

        Application a = new Application();
        a.solidIri = solidIri;
        com.linkedpipes.lpa.backend.Application.SOCKET_IO_SERVER.getRoomOperations(username).sendEvent("applicationAdded", OBJECT_MAPPER.writeValueAsString(a));

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
