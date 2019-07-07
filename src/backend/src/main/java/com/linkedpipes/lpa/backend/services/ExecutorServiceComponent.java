package com.linkedpipes.lpa.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.constants.SupportedRDFMimeTypes;
import com.linkedpipes.lpa.backend.controllers.VirtuosoController;
import com.linkedpipes.lpa.backend.entities.*;
import com.linkedpipes.lpa.backend.entities.database.*;
import com.linkedpipes.lpa.backend.entities.profile.DiscoverySession;
import com.linkedpipes.lpa.backend.entities.profile.PipelineExecution;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.PollingCompletedException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.services.virtuoso.VirtuosoService;
import com.linkedpipes.lpa.backend.util.GitHubUtils;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import com.linkedpipes.lpa.backend.util.IExecutionCallback;
import com.linkedpipes.lpa.backend.util.SparqlUtils;

import com.linkedpipes.lpa.backend.util.RdfUtils;
import com.linkedpipes.lpa.backend.util.rdfbuilder.ModelBuilder;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFLanguages;
import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.File;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicInteger;

import static java.util.concurrent.TimeUnit.MINUTES;
import static java.util.concurrent.TimeUnit.SECONDS;

/**
 * Wrapper to start discovery or execution while linking it on user
 * profile in the database.
 */
@Service
@Profile("!disableDB")
public class ExecutorServiceComponent implements ExecutorService {
    private static final Logger logger = LoggerFactory.getLogger(ExecutorServiceComponent.class);
    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper()
                    .setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));
    private static final String DATA_SAMPLE_RESULT_GRAPH_IRI = Application.getConfig().getString(ApplicationPropertyKeys.DATA_SAMPLE_RESULT_GRAPH_IRI);
    private static final String SHARED_VOLUME_DIR = Application.getConfig().getString(ApplicationPropertyKeys.DATA_SAMPLE_SHARED_VOLUME_DIR);


    private final int DISCOVERY_TIMEOUT_MINS = Application.getConfig().getInt(ApplicationPropertyKeys.DISCOVERY_POLLING_TIMEOUT);
    private final int ETL_TIMEOUT_MINS = Application.getConfig().getInt(ApplicationPropertyKeys.ETL_POLLING_TIMEOUT);
    private final int DISCOVERY_POLLING_FREQUENCY_SECS = Application.getConfig().getInt(ApplicationPropertyKeys.DISCOVERY_POLLING_FREQUENCY);
    private final int ETL_POLLING_FREQUENCY_SECS = Application.getConfig().getInt(ApplicationPropertyKeys.ETL_POLLING_FREQUENCY);
    @NotNull private final AtomicInteger counter = new AtomicInteger(0);
    @NotNull private final DiscoveryService discoveryService;
    @NotNull private final EtlService etlService;
    @NotNull private final UserService userService;

    @Autowired
    private DiscoveryRepository discoveryRepository;

    @Autowired
    private ExecutionRepository executionRepository;

    public ExecutorServiceComponent(ApplicationContext context) {
        this.discoveryService = context.getBean(DiscoveryService.class);
        this.etlService = context.getBean(EtlService.class);
        this.userService = context.getBean(UserService.class);
    }

    /**
     * Start a discovery using the provided configuration.
     *
     * @param discoveryConfig configuration passed to discovery service
     * @param userId web ID of the user who started the discovery
     * @return discovery ID wrapped in JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public DiscoverySession startDiscoveryFromConfig(@NotNull String discoveryConfig, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInput(discoveryConfig);
        DiscoveryDao d = this.userService.setUserDiscovery(userId);
        processStartedDiscovery(discovery.id, d.getId(), userId, null, null, null);
        return DiscoverySession.create(d.getId(), discovery.id);
    }

    /**
     * Start a discovery using a configuration located at some IRI, log the started
     * discovery in the DB on the user profile, notify discovery started via
     * sockets and start status polling.
     *
     * @param discoveryConfigIri configuration IRI passed to discovery service
     * @param userId web ID of the user who started the discovery
     * @return discovery session JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public DiscoverySession startDiscoveryFromConfigIri(@NotNull String discoveryConfigIri, @NotNull String userId) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromInputIri(discoveryConfigIri);
        DiscoveryDao d = this.userService.setUserDiscovery(userId);
        processStartedDiscovery(discovery.id, d.getId(), userId, null, null, null);
        return DiscoverySession.create(d.getId(), discovery.id);
    }

    /**
     * Start a discovery using a provided SPARQL endpoint, log the started
     * discovery in the DB on the user profile, notify discovery started via
     * sockets and start status polling.
     *
     * @param userId web ID of the user who started the discovery
     * @param sparqlEndpointIri SPARQL endpoint IRI provided in frontend to be
     * recorded in the DB
     * @param dataSampleIri data sample IRI provided in frontend to be recorded
     * in the DB (if not present, the sample will be generated)
     * @param namedGraphs list of provided named graphs to be recorded in the DB
     * @return discovery session JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public DiscoverySession startDiscoveryFromEndpoint(@NotNull String userId, @Nullable String sparqlEndpointIri, @Nullable String dataSampleIri, @Nullable List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        DiscoveryDao d = userService.setUserDiscovery(userId);
        long sessionId = d.getId();

        if (dataSampleIri == null) {
            return runDataSamplePipeline(sparqlEndpointIri, namedGraphs, userId, sessionId);
        } else {
            return executeDiscoveryFromEndpoint(userId, sessionId, sparqlEndpointIri, dataSampleIri, namedGraphs);
        }
    }

    private DiscoverySession executeDiscoveryFromEndpoint(@NotNull String userId, @NotNull long sessionId, @Nullable String sparqlEndpointIri, @Nullable String dataSampleIri, @Nullable List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        Discovery discovery = this.discoveryService.startDiscoveryFromEndpoint(sparqlEndpointIri, dataSampleIri, namedGraphs);
        processStartedDiscovery(discovery.id, sessionId, userId, sparqlEndpointIri, dataSampleIri, namedGraphs);
        return DiscoverySession.create(sessionId, discovery.id);
    }

    /**
     * Start a discovery using a provided IRI referencing an RDF file, by reading the RDF data
     * from the URI and proceeding to start discovery using that data
     *
     * @param userId web ID of the user who started the discovery
     * @param rdfFileIri IRI to a file containing RDF data
     * @param dataSampleIri data sample IRI provided in frontend to be recorded in the DB (if not present it will be generated)
     * @return discovery session JSON object
     * @throws LpAppsException call to discovery failed
     * @throws IOException reading RDF data from URI failed
     */
    @NotNull @Override
    public DiscoverySession startDiscoveryFromInputIri(@NotNull String rdfFileIri, @NotNull String userId, @Nullable String dataSampleIri) throws LpAppsException, IOException {
        //read rdf data from iri and upload it to our virtuoso, create discovery config
        ModelBuilder mb = ModelBuilder.from(new URL(rdfFileIri));
        //get rdf data in TTL format
        String rdfData = mb.toString();
        return startDiscoveryFromInput(rdfData, RDFLanguages.TTL, userId, dataSampleIri);
    }

    /**
     * Start a discovery using provided RDF data, by uploading the RDF data into our Virtuoso
     * instance, and proceed to start the discovery using our Virtuoso's SPARQL endpoint
     *
     * @param userId web ID of the user who started the discovery
     * @param rdfData RDF data
     * @param rdfLanguage RDF file format
     * @param dataSampleIri data sample IRI provided in frontend to be recorded in the DB (if not present it will be generated)
     * @return discovery session JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @Nullable @Override
    public DiscoverySession startDiscoveryFromInput(@NotNull final String rdfData, @NotNull Lang rdfLanguage, @NotNull String userId, @Nullable String dataSampleIri) throws LpAppsException, UserNotFoundException {
        //upload rdf in TTL format to our virtuoso, create discovery config and pass it to discovery
        String turtleRdfData = RdfUtils.RdfDataToTurtleFormat(rdfData, rdfLanguage);
        String namedGraph = VirtuosoService.putTtlToVirtuosoRandomGraph(turtleRdfData);
        String endpoint = Application.getConfig().getString(ApplicationPropertyKeys.VIRTUOSO_QUERY_ENDPOINT);
        DiscoveryDao d = userService.setUserDiscovery(userId);
        long sessionId = d.getId();

        if (dataSampleIri == null) {
            //generate data sample from named graph here
            return runDataSamplePipeline(endpoint, Arrays.asList(namedGraph), userId, sessionId);
        } else {
            return executeDiscoveryFromEndpoint(userId, sessionId, endpoint, dataSampleIri, Arrays.asList(namedGraph));
        }
    }

    /**
     * Run ETL pipeline for data sample preparation. After the pipeline finishes
     * sample callback is executed.
     *
     * Execution is protected by a semaphore, ensuring at most one such pipeline
     * is running at all times (because the underlying pipeline has a hardcoded
     * graph name as well as because we clean a shared data folder using a
     * wildcard delete.
     *
     * @param sparqlEndpointIri our virtuoso SPARQL endpoint IRI
     * @param namedGraphs list of named graphs, if null or empty we return
     * immediately, should contain exactly one graph, if there are more, only
     * the first one is used
     * @param userId WebID
     * @param sessionId ID of discovery object in the database
     * @return intermediate discovery session object indicating sessionId to
     * identify future socket messages
     * @throws LpAppsException failed to execute data sample pipeline
     */
    private DiscoverySession runDataSamplePipeline(final String sparqlEndpointIri, final List<String> namedGraphs, final String userId, long sessionId) throws LpAppsException {
        logger.debug("Will execute data sample pipeline");
        if ((namedGraphs == null) || (namedGraphs.size() < 1)) {
            logger.error("Failed to execute data sample pipeline - named graphs null or empty");
            return DiscoverySession.createError(sessionId);
        } else if (namedGraphs.size() > 1) {
            logger.warn("More than 1 named graphs submitted, only the first one will be used for data sample generation");
        }

        counter.compareAndSet(0, 1); //SEMAPHORE

        // === PROTECTED SECTION ===
        File dir = new File(SHARED_VOLUME_DIR);
        try {
            FileUtils.forceMkdir(dir);
        } catch (IOException ex) {
            logger.error("Failed to ensure existence of the shared folder before pipeline execution", ex);
        }

        try {
            FileUtils.cleanDirectory(dir); //make sure we have empty dir as we upload *.ttl to virtuoso
        } catch (IOException ex) {
            logger.warn("Failed to clean the shared folder before pipeline execution", ex);
        }

        Execution dsPipe = etlService.executeDataSamplePipeline(sparqlEndpointIri, namedGraphs.get(0));
        startEtlStatusPolling(dsPipe.iri, getSampleCallback(userId, sparqlEndpointIri, namedGraphs, sessionId));

        return DiscoverySession.create(sessionId, null);
    }

    private void reportError(long sessionId, final String userId) {
        try {
            DiscoverySession session = DiscoverySession.createError(sessionId);
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("discoveryAdded", OBJECT_MAPPER.writeValueAsString(session));
        } catch (LpAppsException e) {
            logger.error("Failed to report error", e);
        }
    }

    /**
     * Sample callback is called after the data sample preparation pipeline is
     * finished.
     *
     * If the pipeline is finished successfully, the result graph is extracted
     * into TTL and uploaded on github pages. The named graph is then removed
     * and discovery started using the generated data sample.
     *
     * Shared directory is cleaned at all times and semaphore is decreased to
     * allow future access.
     *
     * @param userId webID
     * @param sessionId ID of discovery object in the database
     * @param sparqlEndpointIri our virtuoso SPARQL endpoint IRI
     * @param namedGraphs list of named graphs, it must have at least one item
     * inside but we assume it was checked earlier
     * @return callback to be executed after polling for the ETL pipeline finishes
     */
    private IExecutionCallback getSampleCallback(final String userId, final String sparqlEndpointIri, final List<String> namedGraphs, final long sessionId) {
        return new IExecutionCallback() {
            public void execute(EtlStatusReport report) {
                if (counter.get() != 1) {
                    logger.warn("Executing sample callback while counter is not 1!");
                }

                try {
                    FileUtils.cleanDirectory(new File(SHARED_VOLUME_DIR));
                } catch (IOException ex) {
                    logger.warn("Failed to clean the shared folder after pipeline", ex);
                }

                if (report.status.status.equals(EtlStatus.FINISHED)) {
                    logger.info("Pipeline finished, should extract sample now");
                    //extract data sample from graph: https://applications.linkedpipes.com/graph/test-data-sample-graph
                    String ttl = SparqlUtils.extractTTL(DATA_SAMPLE_RESULT_GRAPH_IRI);
                    String gistName = namedGraphs.get(0).substring(VirtuosoController.GRAPH_NAME_PREFIX.length()) + ".ttl";
                    try {
                        String dataSampleIri = GitHubUtils.uploadGistFile(gistName, ttl);
                        VirtuosoService.deleteNamedGraph(DATA_SAMPLE_RESULT_GRAPH_IRI);
                        executeDiscoveryFromEndpoint(userId, sessionId, sparqlEndpointIri, dataSampleIri, namedGraphs);
                        //this will trigger socket notification of the started discovery & starts polling
                    } catch (LpAppsException|UserNotFoundException ex) {
                        logger.error("Failed to start discovery after generating data sample: " + report.executionIri, ex);
                        reportError(sessionId, userId);
                    } catch (IOException e) {
                        logger.error("Failed to export generated data sample to github (" + gistName + "), sample was:\n" + ttl, e);
                        reportError(sessionId, userId);
                    }
                } else {
                    logger.error("Data sample pipeline finished with errors");
                    reportError(sessionId, userId);
                }

                if (counter.decrementAndGet() != 0) {
                    logger.warn("Leaving sample callback with counter not 0");
                }
            }
        };
    }

    /**
     * Start a discovery using provided RDF data, by uploading the RDF data into our Virtuoso
     * instance, and proceed to start the discovery using our Virtuoso's SPARQL endpoint
     *
     * @param userId web ID of the user who started the discovery
     * @param rdfFile RDF data in file
     * @param dataSampleFile data sample in file (if not present it will be generated)
     * @return discovery session JSON object
     * @throws LpAppsException call to discovery failed
     * @throws UserNotFoundException user was not found
     */
    @NotNull @Override
    public DiscoverySession startDiscoveryFromInputFiles(@NotNull MultipartFile rdfFile, @Nullable MultipartFile dataSampleFile, @NotNull String userId) throws LpAppsException, IOException {
        Lang rdfFileLanguage = SupportedRDFMimeTypes.mimeTypeToRiotLangMap.get(rdfFile.getContentType());
        if (rdfFileLanguage == null) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "File content type not supported");
        }

        String dataSampleIri = null;
        if ( dataSampleFile != null ) {
            Lang dataSampleFileLanguage = SupportedRDFMimeTypes.mimeTypeToRiotLangMap.get(dataSampleFile.getContentType());
            dataSampleIri = GitHubUtils.uploadGistFile(dataSampleFile.getName(), RdfUtils.RdfDataToTurtleFormat(new String(dataSampleFile.getBytes()), dataSampleFileLanguage));
        }

        return startDiscoveryFromInput(new String(rdfFile.getBytes()), rdfFileLanguage, userId, dataSampleIri);

    }

    /**
    * Log a discovery onto user, notify discovery started via sockets and
    * start status polling.
    *
    * @param discoveryId ID of the discovery that was started
    * @param dbId database ID of the discovery object (sessionId passed to frontend / in DiscoverySession)
    * @param sparqlEndpointIri SPARQL endpoint IRI provided in frontend to be recorded in the DB
    * @param dataSampleIri data sample IRI provided in frontend to be recorded in the DB
    * @param namedGraphs list of provided named graphs to be recorded in the DB
    * @throws LpAppsException initial discovery status call failed
    * @throws UserNotFoundException user was not found
    */
    private void processStartedDiscovery(String discoveryId, long dbId, String userId, String sparqlEndpointIri, String dataSampleIri, List<String> namedGraphs) throws LpAppsException, UserNotFoundException {
        this.userService.setUserDiscovery(dbId, discoveryId, sparqlEndpointIri, dataSampleIri, namedGraphs);  //this inserts discovery in DB and sets flags
        notifyDiscoveryStarted(discoveryId, userId);
        startDiscoveryStatusPolling(discoveryId);
    }

    /**
    * Get discovery status, pull discovery out of DB, compile a report and send
    * it via sockets:
    * - room: userId
    * - event name: discoveryAdded
    * - message type: DiscoverySession
    *
    * @param discoveryId ID of the discovery that was started
    * @param userId webId of the user who started the discovery (used for socket notifications)
    * @throws LpAppsException request to Discovery failed
    */
    private void notifyDiscoveryStarted(String discoveryId, String userId) throws LpAppsException {
        DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);
        for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
            DiscoverySession session = new DiscoverySession();
            session.discoveryId = d.getDiscoveryId();
            session.sessionId = d.getId();
            session.isFinished = discoveryStatus.isFinished;
            session.isFailed = false;
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
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("discoveryAdded", OBJECT_MAPPER.writeValueAsString(session));
        }
    }

    /**
     * Main callback is called after pipeline for user data preparation is finished.
     * There's only a simple socket notification to the frontend.
     *
     * @return callback to be executed after polling for the ETL pipeline finishes
     */
    private static IExecutionCallback getMainCallback() {
        return new IExecutionCallback() {
            public void execute(EtlStatusReport report) {
                try {
                    Application.SOCKET_IO_SERVER.getRoomOperations(report.executionIri)
                        .sendEvent("executionStatus",
                                   OBJECT_MAPPER.writeValueAsString(report));
                } catch (LpAppsException ex) {
                    logger.error("Failed to report execution status: " + report.executionIri, ex);
                }
            }
        };
    }

    /**
     * Call ETL to execute a pipeline, record execution in the DB, notify
     * execution started on sockets and start polling for execution status.
     *
     * @param etlPipelineIri IRI of the ETL pipeline to execute
     * @param userId WebID of the user (used to select where to map execution in DB, where to notify on sockets)
     * @param selectedVisualiser frontend string stored in DB
     * @return execution iri in JSON object for frontend to use
     * @throws LpAppsException request to ETL failed
     * @throws UserNotFoundException user not found
     */
    @NotNull @Override
    public Execution executePipeline(@NotNull String etlPipelineIri, @NotNull String userId, @NotNull String selectedVisualiser, @NotNull boolean startedByUser) throws LpAppsException, UserNotFoundException {
        Execution execution = this.etlService.executePipeline(etlPipelineIri);
        this.userService.setUserExecution(userId, execution.iri, etlPipelineIri, selectedVisualiser);  //this inserts execution in DB
        notifyExecutionStarted(execution.iri, userId);
        startEtlStatusPolling(execution.iri, getMainCallback());
        return execution;
    }

    /**
    * Get execution status, pull execution out of DB, compile a report and send
    * it via sockets:
    * - room: userId
    * - event name: executionAdded
    * - message type: PipelineExecution
    *
    * @param executionIri executionIri for which to get status
    * @param userId webId to use for identification of a room where to notify via sockets
    * @throws LpAppsException request to ETL failed
    */
    private void notifyExecutionStarted(String executionIri, String userId) throws LpAppsException {
        ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            PipelineExecution exec = PipelineExecution.getPipelineExecutionFromDao(e);
            Application.SOCKET_IO_SERVER.getRoomOperations(userId).sendEvent("executionAdded", OBJECT_MAPPER.writeValueAsString(exec));
        }
    }

    /**
     * Create a runnable for status checking and schedule it's periodic execution.
     * Also schedule a one-time off runnable to stop polling after a while.
     *
     * Status is fetched from the ETL and updated in the database.
     * If execution is finished we report it via sockets and stop periodic
     * execution by throwing PollingCompletedException.
     *
     * Status message on sockets:
     * - room: executionIri
     * - event name: executionStatus
     * - message type: EtlStatusReport
     *
     * @param executionIri execution IRI to poll for
     */
    private void startEtlStatusPolling(final String executionIri, final IExecutionCallback callback) {
        Runnable checker = () -> {
            PipelineInformationDao pipeline = null;
            try {
                ExecutionStatus executionStatus = etlService.getExecutionStatus(executionIri);

                //persist status in DB and get pipeline information
                for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                    //there should be only one
                    e.setStatus(executionStatus.status);
                    if (!executionStatus.status.isPollable()) {
                        e.setFinished(executionStatus.finished);
                    }
                    pipeline = e.getPipeline();
                    executionRepository.save(e);
                }

                if (!executionStatus.status.isPollable()) {
                    EtlStatusReport report = EtlStatusReport.createStandardReport(executionStatus, executionIri, pipeline);
                    callback.execute(report);
                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                logger.error("Got exception when polling for ETL status.", e);

                EtlStatusReport report = EtlStatusReport.createErrorReport(executionIri, false, pipeline);
                callback.execute(report);
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, ETL_POLLING_FREQUENCY_SECS, ETL_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
                if (e.getStatus() != EtlStatus.FINISHED) {
                    logger.info("Cancelling execution");
                    EtlStatusReport report = EtlStatusReport.createErrorReport(executionIri, true, null);
                    callback.execute(report);
                    cancelExecution(e, executionIri);
                }
            }
            counter.lazySet(0); //make sure we unlock the data sample pipeline
        };

        logger.info("Scheduling canceler to run in " + ETL_TIMEOUT_MINS + " minutes.");
        Application.SCHEDULER.schedule(canceller, ETL_TIMEOUT_MINS, MINUTES);
    }

    private void cancelExecution(final ExecutionDao e, final String executionIri) {
        try {
            etlService.cancelExecution(executionIri);
            e.setStatus(EtlStatus.CANCELLED);
            // technically this should go to cancelling and then cancelled by ETL, but we don't care anymore
        } catch (LpAppsException ex) {
            logger.warn("Failed to cancel execution " + executionIri, ex);
            e.setStatus(EtlStatus.UNKNOWN);
        }
        executionRepository.save(e);
    }

    /**
     * Cancel an execution identified by IRI.
     * It will report final status using sockets.
     * Also, polling thread is still running until the actual ETL status won't
     * stop being "pollable".
     *
     * @param executionIri execution IRI to cancel
     */
    @Override
    public void cancelExecution(final String executionIri) {
        for (ExecutionDao e : executionRepository.findByExecutionIri(executionIri)) {
            cancelExecution(e, executionIri);
        }
    }

    /**
     * Create a runnable for status checking and schedule it's periodic execution.
     * Also schedule a one-time off runnable to stop polling after a while.
     *
     * Status is fetched from the Discovery and updated in the database.
     * If execution is finished we report it via sockets and stop periodic
     * execution by throwing PollingCompletedException.
     *
     * Status message on sockets:
     * - room: discoveryId
     * - event name: discoveryStatus
     * - message type: DiscoveryStatusReport
     *
     * @param discoveryId discovery id to poll for
     */
    private void startDiscoveryStatusPolling(String discoveryId) {
        Runnable checker = () -> {
            DiscoveryDao dao = null;
            try {
                DiscoveryStatus discoveryStatus = discoveryService.getDiscoveryStatus(discoveryId);

                if (discoveryStatus.isFinished) {
                    Date finished = new Date();

                    for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
                        d.setExecuting(false);
                        d.setFinished(finished);
                        discoveryRepository.save(d);
                        dao = d;
                    }

                    logger.info("Reporting discovery finished in room " + discoveryId);
                    DiscoveryStatusReport report = DiscoveryStatusReport.createStandardReport(discoveryId, discoveryStatus, finished, dao);

                    try {
                        Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId)
                            .sendEvent("discoveryStatus",
                                   OBJECT_MAPPER.writeValueAsString(report));
                    } catch (LpAppsException ex) {
                        logger.error("Failed to report discovery status: " + discoveryId, ex);
                    }


                    throw new PollingCompletedException(); //this cancels the scheduler
                }
            } catch (LpAppsException e) {
                DiscoveryStatusReport report = DiscoveryStatusReport.createErrorReport(discoveryId, false, dao);
                try {
                    Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(report));
                } catch (LpAppsException ex) {
                    logger.error("Failed to report discovery status: " + discoveryId, ex);
                }
                throw new PollingCompletedException(e); //this cancels the scheduler
            }
        };

        ScheduledFuture<?> checkerHandle = Application.SCHEDULER.scheduleAtFixedRate(checker, DISCOVERY_POLLING_FREQUENCY_SECS, DISCOVERY_POLLING_FREQUENCY_SECS, SECONDS);

        Runnable canceller = () -> {
            checkerHandle.cancel(false);
            cancelDiscovery(discoveryId);
        };

        Application.SCHEDULER.schedule(canceller, DISCOVERY_TIMEOUT_MINS, MINUTES);
    }

    /**
     * Update discovery status in DB to finished, send report on sockets,
     * send cancel discovery call to actually stop it.
     *
     * Polling thread is still running until the actual Discovery status won't
     * be finished.
     */
    @Override
    public void cancelDiscovery(final String discoveryId) {
        Date finished = new Date();
        DiscoveryDao dao = null;
        for (DiscoveryDao d : discoveryRepository.findByDiscoveryId(discoveryId)) {
            d.setExecuting(false);
            d.setFinished(finished);
            discoveryRepository.save(d);
            dao = d;
        }
        DiscoveryStatusReport report = DiscoveryStatusReport.createErrorReport(discoveryId, true, dao);

        try {
            Application.SOCKET_IO_SERVER.getRoomOperations(discoveryId).sendEvent("discoveryStatus", OBJECT_MAPPER.writeValueAsString(report));
        } catch (LpAppsException ex) {
            logger.error("Failed to report discovery status: " + discoveryId, ex);
        }

        try {
            discoveryService.cancelDiscovery(discoveryId);
        } catch (LpAppsException ex) {
            logger.warn("Failed to cancel discovery " + discoveryId, ex);
        }
    }
}
