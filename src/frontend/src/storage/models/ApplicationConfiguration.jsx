import FilterConfiguration from './FilterConfiguration';

/**
 * Model class for storing application configuration.
 */
export default class ApplicationConfiguration {
  /** Expresses the url of the context for jsonld configuration. */
  context: string;

  /** Type of the ontology class. */
  type: string;

  id: string;

  author: string;

  title: string;

  backgroundColor: string;

  graphIri: string;

  conceptIri: string;

  etlExecutionIri: string;

  endpoint: string;

  visualizerType: string;

  filterConfiguration: FilterConfiguration;

  constructor(
    context: string,
    type: string,
    id: string,
    author: string,
    title: string,
    backgroundColor: string,
    graphIri: string,
    conceptIri: string,
    etlExecutionIri: string,
    endpoint: string,
    visualizerType: string,
    filterConfiguration: string
  ) {
    this.context = context;
    this.type = type;
    this.id = id;
    this.author = author;
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.graphIri = graphIri;
    this.conceptIri = conceptIri;
    this.etlExecutionIri = etlExecutionIri;
    this.endpoint = endpoint;
    this.visualizerType = visualizerType;
    this.filterConfiguration = filterConfiguration;
  }
}
