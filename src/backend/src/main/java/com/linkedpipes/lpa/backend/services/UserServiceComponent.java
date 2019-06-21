package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.services.virtuoso.VirtuosoService;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
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

/**
 * User profile management functionality.
 */
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
    private PipelineInformationRepository pipelineRepository;

    @Autowired
    private DiscoveryNamedGraphRepository ngRepository;

    @Autowired
    private ApplicationRepository appRepository;


    /**
    * Returns the user's profile. If user doesn't exist yet we add them.
    *
    * As SOLID is used for authentication, on the backend side there's a fully
    * transparent way of adding a new user.
    *
    * Returned is a user's profile containing all user's discoveries and
    * executions along with their status (as currently stored in the DB by
    * the ExecutorService)
    *
    * @param webId webId to add / fetch
    * @return user profile
    */
    @NotNull @Override @Transactional(isolation = Isolation.SERIALIZABLE)
    public UserProfile addUserIfNotPresent(@NotNull final String webId) {
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

    /**
     * Add discovery on user profile. Discovery started time is set to current
     * time.
     *
     * @param username webId
     * @param discoveryId discovery ID
     * @param sparqlEndpointIri SPARQL endpoint IRI as provided by user on frontend
     * @param dataSampleIri data sample IRI as provided by user on frontend
     * @param namedGraphs list of IRIs as provided on frontend
     * @throws UserNotFoundException user was not found in database
     */
    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public void setUserDiscovery(@NotNull final String username,
                                 @NotNull final String discoveryId,
                                 @Nullable final String sparqlEndpointIri,
                                 @Nullable final String dataSampleIri,
                                 @Nullable final List<String> namedGraphs)
                                 throws UserNotFoundException {
        UserDao user = getUser(username);
        DiscoveryDao d = new DiscoveryDao();
        d.setDiscoveryStarted(discoveryId, new Date());
        d.setSparqlEndpointIri(sparqlEndpointIri);
        d.setDataSampleIri(dataSampleIri);
        if (namedGraphs != null) {
            for (String namedGraph : namedGraphs) {
                DiscoveryNamedGraphDao ng = new DiscoveryNamedGraphDao();
                ng.setNamedGraph(namedGraph);
                d.addNamedGraph(ng);
                ngRepository.save(ng);
            }
        }
        user.addDiscovery(d);
        discoveryRepository.save(d);
        repository.save(user);
    }

    private UserDao getUser(final String username) throws UserNotFoundException {
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

    /**
     * Add execution on user profile.
     *
     * If there are more pipeline information records, first one is used.
     * Execution started time is set to current time.
     *
     * @param username webId
     * @param executionIri ETL execution IRI
     * @param etlPipelineIri ETL pipeline IRI
     * @param selectedVisualiser selected visualiser for this execution (cached in DB by frontend)
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public void setUserExecution(@NotNull final String username,
                                 @NotNull final String executionIri,
                                 @NotNull final String etlPipelineIri,
                                 @NotNull final String selectedVisualiser)
                                 throws UserNotFoundException {
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

    /**
    * Fetch everything we know about this user: all applications, all
    * discoveries (inc. named graphs used) and all executions and return it
    * in one object.
    *
    * @param user User profile as in the DB
    * @return user profile to be sent to frontend
    */
    private UserProfile transformUserProfile(final UserDao user) {
        UserProfile profile = new UserProfile();
        profile.webId = user.getWebId();
        profile.color = user.getColor();
        profile.discoverySessions = new ArrayList<>();
        if (user.getDiscoveries() != null) {
            for (DiscoveryDao d : user.getDiscoveries()) {
                DiscoverySession session = new DiscoverySession();
                session.discoveryId = d.getDiscoveryId();
                session.isFinished = !d.getExecuting();
                session.started = d.getStarted().getTime() / 1000L;
                if (d.getFinished() != null) {
                    session.finished = d.getFinished().getTime() / 1000L;
                } else {
                    session.finished = -1;
                }
                session.sparqlEndpointIri = d.getSparqlEndpointIri();
                session.dataSampleIri = d.getDataSampleIri();
                session.namedGraphs = new ArrayList<>();
                for (DiscoveryNamedGraphDao ng : d.getNamedGraphs()) {
                    session.namedGraphs.add(ng.getNamedGraph());
                }
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
                exec.started = e.getStarted().getTime() / 1000L;
                exec.scheduleOn = e.isScheduled();
                exec.startedByUser = e.isStartedByUser();
                if (e.getFinished() != null) {
                    exec.finished = e.getFinished().getTime() / 1000L;
                } else {
                    exec.finished = -1;
                }
                profile.pipelineExecutions.add(exec);
            }
        }

        profile.applications = new ArrayList<>();
        if (user.getApplications() != null) {
            for (ApplicationDao application : user.getApplications()) {
                Application app = new Application();
                app.solidIri = application.getSolidIri();
                app.executionAvailable = (application.getExecution() != null) && (!application.getExecution().isRemoved());
                profile.applications.add(app);
            }
        }

        return profile;
    }

    /**
     * If there's an execution with IRI equal to the provided one on the user
     * profile, it will be removed.
     * Also, if there's only one execution of the pipeline that's being deleted,
     * the pipeline information record is also deleted.
     *
     * @param username webId
     * @param executionIri IRI of execution to be removed from database
     * @return user profile after modification
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile deleteExecution(@NotNull final String username,
                                       @NotNull final String executionIri)
                                       throws UserNotFoundException {
        UserDao user = getUser(username);
        ExecutionDao toDelete = null;

        for (ExecutionDao execution : user.getExecutions()) {
            if (execution.getExecutionIri().equals(executionIri)) {
                toDelete = execution;
                break;
            }
        }

        removeExecutionFromUser(user, toDelete);

        return transformUserProfile(user);
    }

    private void removeExecutionFromUser(UserDao user, ExecutionDao toDelete) {
        PipelineInformationDao pipelineInformationToDelete = null;

        if (toDelete != null) {
            user.removeExecution(toDelete);

            if (executionRepository.findExecutionsUsingPipelineNative(toDelete.getPipelineId()).size() == 1) {
                pipelineInformationToDelete = toDelete.getPipeline();
            }

            List<ExecutionDao> executions = new ArrayList<>();
            for (PipelineInformationDao x : pipelineRepository.findByResultGraphIri(toDelete.getPipeline().getResultGraphIri())) {
                executions.addAll(x.getExecutions());
            }

            if (toDelete.getApplications().isEmpty()) { //this is for repeated executions using the same NG
                //no applications - delete from virtuoso
                String graphName = toDelete.getPipeline().getResultGraphIri();
                VirtuosoService.deleteNamedGraph(graphName);

                for (ExecutionDao e : executions) {
                    executionRepository.delete(e);
                }

                if (pipelineInformationToDelete != null) {
                    pipelineRepository.delete(pipelineInformationToDelete);
                }
            } else {
                toDelete.setRemoved(true);
                executionRepository.save(toDelete);
            }

            repository.save(user);
        }
    }

    /**
     * If there's a discovery with ID equal to the provided one on the user
     * profile, it will be removed. Keep in mind that named graphs used with
     * this discovery will be removed as well as there's a DB constraint in place.
     *
     * @param username webId
     * @param discoveryId ID of discovery to be removed from database
     * @return user profile after modification
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile deleteDiscovery(@NotNull final String username,
                                       @NotNull final String discoveryId)
                                       throws UserNotFoundException {
        UserDao user = getUser(username);
        DiscoveryDao toDelete = null;
        for (DiscoveryDao discovery : user.getDiscoveries()) {
            if (discovery.getDiscoveryId().equals(discoveryId)) {
                toDelete = discovery;
                break;
            }
        }

        if (toDelete != null) {
            user.removeDiscovery(toDelete);
            discoveryRepository.delete(toDelete);
            repository.save(user);
        }

        return transformUserProfile(user);
    }

    /**
     * Set color scheme chosen by user.
     *
     * @param username webId
     * @param color a string sent by frontend, that will appear on user profile
     * @return user profile after modification
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile setUserColorScheme(@NotNull final String username,
                                          @NotNull final String color)
                                          throws UserNotFoundException {
        UserDao user = getUser(username);
        user.setColor(color);
        repository.save(user);
        return transformUserProfile(user);
    }

    @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile addApplication(String username, String executionIri, String solidIri) throws UserNotFoundException {
        UserDao user = getUser(username);

        for (ExecutionDao e : user.getExecutions()) {
            if (e.getExecutionIri().equals(executionIri)) {
                ApplicationDao app = new ApplicationDao();
                app.setSolidIri(solidIri);
                e.addApplication(app);
                user.addApplication(app);

                repository.save(user);
                executionRepository.save(e);
                appRepository.save(app);
                break;
            }
        }

        return transformUserProfile(user);
    }

    @Override @Transactional(rollbackFor=UserNotFoundException.class)
    public UserProfile deleteApplication(String username, String solidIri) throws UserNotFoundException {
        UserDao user = getUser(username);

        for (ApplicationDao app : user.getApplications()) {
            if (app.getSolidIri().equals(solidIri)) {
                ExecutionDao execution = app.getExecution();
                if (null != execution) {
                    if (execution.isScheduled()) {
                        for (PipelineInformationDao x : pipelineRepository.findByResultGraphIri(execution.getPipeline().getResultGraphIri())) {
                            for (ExecutionDao y : x.getExecutions()) {
                                if (!y.getExecutionIri().equals(execution.getExecutionIri())) {
                                    executionRepository.delete(y);
                                }
                            }
                        }
                    }

                    boolean allRemoved = execution.isRemoved();
                    if (allRemoved) {
                        for (PipelineInformationDao x : pipelineRepository.findByResultGraphIri(execution.getPipeline().getResultGraphIri())) {
                            for (ExecutionDao y : x.getExecutions()) {
                                if (!y.isRemoved()) {
                                    allRemoved = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (allRemoved) {
                        //all executions were already removed
                        String graphName = app.getExecution().getPipeline().getResultGraphIri();
                        VirtuosoService.deleteNamedGraph(graphName);

                        executionRepository.delete(execution);
                    } else {
                        execution.removeApplication(app);
                        executionRepository.save(execution);
                    }
                }

                user.removeApplication(app);
                appRepository.delete(app);
                repository.save(user);
                break;
            }
        }

        return transformUserProfile(user);
    }

}
