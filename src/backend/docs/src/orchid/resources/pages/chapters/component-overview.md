---
menu:
  - type: "pageContent"
    title: "Component overview"
    order: 2
---

## Backend component overview

LPA Backend is responsible for providing services which the Frontend uses to help provide the required functionality
to the end user. It is a RESTful web application written on top of the Spring Boot framework.

It follows a modified MVC architecture model. The complete list of use-case related responsibilities is as follows:

- Communication with the _Discovery_ component
  - Creation of new Discovery runs &ndash; see
    [DiscoveryController](/com/linkedpipes/lpa/backend/controllers/DiscoveryController)
  - Generating and providing to Discovery a suitable configuration of data sources, transformers, and visualizers for
    each Discovery invocation
    - Construction of data source description files readable by Discovery &ndash; see
      [DataSourceController](/com/linkedpipes/lpa/backend/controllers/DataSourceController)
    - Construction of SPARQL service description targeting the _Virtuoso_ component of LPA &ndash; see method
      `serviceDescription` in [VirtuosoController](/com/linkedpipes/lpa/backend/controllers/VirtuosoController)
  - Handling of Discovery run results &ndash; see method `getPipelineGroups` in
    [DiscoveryController](/com/linkedpipes/lpa/backend/controllers/DiscoveryController)
  - Creation of new pipelines by exporting them from Discovery &ndash; see `exportPipeline*` methods in
    [PipelineController](/com/linkedpipes/lpa/backend/controllers/PipelineController)
- Communication with the _ETL_ component
  - Starting the execution of and providing more information about pipelines &ndash; see
    [PipelineController](/com/linkedpipes/lpa/backend/controllers/PipelineController)
  - Determining the result of a pipeline execution &ndash; see
    [ExecutionController](/com/linkedpipes/lpa/backend/controllers/ExecutionController)
- Communication with the _Virtuoso_ component
  - Retrieval of the pipeline execution results for visualization from the Virtuoso database component
    - d3.js Chord visualizer (RGML vocabulary data) &ndash; see
      [D3ChordVisualizerController](/com/linkedpipes/lpa/backend/controllers/D3ChordVisualizerController)
    - Map visualizer (Schema and SKOS vocabulary data) &ndash; see
      [MapVisualizerController](/com/linkedpipes/lpa/backend/controllers/MapVisualizerController)
    - Google Charts Treemap visualizer (SKOS vocabulary data) &ndash; see
      [SkosController](/com/linkedpipes/lpa/backend/controllers/SkosController)
  - Manipulate named graphs
    - Creation of some sample data for
    - CRUD operations &ndash; see `*NamedGraph*` methods in [VirtuosoController](/com/linkedpipes/lpa/backend/controllers/VirtuosoController)
- CRUD operations on model entities:
  - [`User`](/com/linkedpipes/lpa/backend/entities/database/UserDao) representing a user profile
  - [`Discovery`](/com/linkedpipes/lpa/backend/entities/database/DiscoveryDao) representing a Discovery invocation
  - [`Execution`](/com/linkedpipes/lpa/backend/entities/database/ExecutionDao) representing a pipeline execution
  - [`Application`](/com/linkedpipes/lpa/backend/entities/database/ApplicationDao) representing a visualizer instance
