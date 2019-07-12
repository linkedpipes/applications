---
layout: index
components:
  - type: pageContent
---

Backend component overview
--------------------------

LPA Backend is responsible for providing services which the Frontend uses to help provide the required functionality
to the end user. It is a RESTful web application written on top of the Spring Boot framework.
 
It follows a modified MVC architecture model. The complete list of use-case related responsibilities is as follows:

* Communication with the _Discovery_ component
  * Creation of new Discovery runs &ndash; see
    [DiscoveryController](/com/linkedpipes/lpa/backend/controllers/DiscoveryController)
  * Generating and providing to Discovery a suitable configuration of data sources, transformers, and visualizers for
    each Discovery invocation
    * Construction of data source description files readable by Discovery &ndash; see
      [DataSourceController](/com/linkedpipes/lpa/backend/controllers/DataSourceController)
    * Construction of SPARQL service description targeting the _Virtuoso_ component of LPA &ndash; see method
      `serviceDescription` in [VirtuosoController](/com/linkedpipes/lpa/backend/controllers/VirtuosoController)
  * Handling of Discovery run results &ndash; see method `getPipelineGroups` in
    [DiscoveryController](/com/linkedpipes/lpa/backend/controllers/DiscoveryController)
  * Creation of new pipelines by exporting them from Discovery &ndash; see `exportPipeline*` methods in
    [PipelineController](/com/linkedpipes/lpa/backend/controllers/PipelineController)
* Communication with the _ETL_ component
  * Starting the execution of and providing more information about pipelines &ndash; see
    [PipelineController](/com/linkedpipes/lpa/backend/controllers/PipelineController)
  * Determining the result of a pipeline execution &ndash; see
    [ExecutionController](/com/linkedpipes/lpa/backend/controllers/ExecutionController)
* Communication with the _Virtuoso_ component
  * Retrieval of the pipeline execution results for visualization from the Virtuoso database component
    * d3.js Chord visualizer (RGML vocabulary data) &ndash; see
      [D3ChordVisualizerController](/com/linkedpipes/lpa/backend/controllers/D3ChordVisualizerController)
    * Map visualizer (Schema and SKOS vocabulary data) &ndash; see
      [MapVisualizerController](/com/linkedpipes/lpa/backend/controllers/MapVisualizerController)
    * Google Charts Treemap visualizer (SKOS vocabulary data) &ndash; see
      [SkosController](/com/linkedpipes/lpa/backend/controllers/SkosController)
  * Manipulate named graphs
    * Creation of some sample data for 
    * CRUD operations &ndash; see `*NamedGraph*` methods in [VirtuosoController](/com/linkedpipes/lpa/backend/controllers/VirtuosoController)
* CRUD operations on model entities:
  * [`User`](/com/linkedpipes/lpa/backend/entities/database/UserDao) representing a user profile
  * [`Discovery`](/com/linkedpipes/lpa/backend/entities/database/DiscoveryDao) representing a Discovery invocation
  * [`Execution`](/com/linkedpipes/lpa/backend/entities/database/ExecutionDao) representing a pipeline execution
  * [`Application`](/com/linkedpipes/lpa/backend/entities/database/ApplicationDao) representing a visualizer instance

Backend high-level architecture
-------------------------------

As per the aforementioned MVC architecture model, LPA Backend contains following main architectural components:

* **Controllers** that handle deserialization and serialization of the payloads and parameters of the HTTP requests and
  responses. These classes are located in the
  [`com.linkedpipes.lpa.backend.controllers`](/com/linkedpipes/lpa/backend/controllers) java package. The controllers
  utilize _services_ which implement the application's business logic
* **Services** are located in [`com.linkedpipes.lpa.backend.services`](/com/linkedpipes/lpa/backend/services) and
  provide a use-case drive high-level abstraction over the performed tasks
* **Model** entities which are persisted in the persistence layer of Backend; for more information see classes in
  [`com.linkedpipes.lpa.backend.entities.database`](/com/linkedpipes/lpa/backend/entities/database).

Usually, one controller method corresponds directly to one service method, although this may not be the case in all
circumstances. A general invocation of a controller method can be split into these tasks:

* receives an HTTP request
* deserializes the payload and parameters of the request
* validates the payload and parameters
* calls a corresponding service method (or several)
* serializes the response payload
* returns an HTTP response back to the requester

Discovery configuration and <code>base.ttl</code>
-------------------------------------------------

As mentioned earlier, the Backend is tasked, among others, to start new runs of Discovery. _LinkedPipes Discovery_ was
created to be a stateless service. As such, upon each invocation, Discovery needs to be provided a complete run
configuration, consisting of a list of _pipeline components_ to use in the pipeline discovery process. These components
are divided into several categories. The most important of these are:

* _Data sources_ which say where the pipeline should retrieve the raw data set from
* _Transformers_ which say how to partially transform the data set into another state and whether or not the
  transformation is applicable to a data set
* _Visualizers_&mdash;also called Applications&mdash;which say how to visualize a data set and whether or not the
  visualizer is applicable to a data set

The available transformers and visualizers almost never change between Discovery invocations, only the data sources are
being added as per the user's requests. Due to this reason Backend keeps a _base Discovery configuration_ file
`base.ttl` available as a Java classpath resource located in
`/src/backend/src/main/resources/com/linkedpipes/lpa/backend/services/base.ttl`. This file can be modified by adding or
removing transformers or visualizers, which changes which pipeline components are considered during the pipeline
discovery process.
