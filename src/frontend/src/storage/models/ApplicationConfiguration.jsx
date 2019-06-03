/**
 * Model class for storing application configuration.
 */
export default class ApplicationConfiguration {
  id: string;

  author: string;

  title: string;

  backgroundColor: string;

  graphIri: string;

  applicationData: string;

  etlExecutionIri: string;

  endpoint: string;

  visualizerType: string;

  filterGroups: Object;

  published: Date;

  constructor({
    id,
    author,
    title,
    backgroundColor,
    graphIri,
    applicationData,
    etlExecutionIri,
    endpoint,
    visualizerType,
    filterGroups,
    published
  }) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.graphIri = graphIri;
    this.applicationData = applicationData;
    this.etlExecutionIri = etlExecutionIri;
    this.endpoint = endpoint;
    this.visualizerType = visualizerType;
    this.filterGroups = filterGroups;
    this.published = published;
  }

  static from(json) {
    let jsonObject = json;

    if (typeof jsonObject === 'string' || jsonObject instanceof String)
      jsonObject = JSON.parse(json);

    return new ApplicationConfiguration(jsonObject);
  }
}
