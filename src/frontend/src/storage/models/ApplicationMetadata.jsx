import ApplicationConfiguration from './ApplicationConfiguration';

/**
 * Model class for storing application configuration.
 */
export default class ApplicationMetadata {
  solidFileTitle: string;

  solidFileUrl: string;

  configuration: ApplicationConfiguration;

  constructor({ solidFileTitle, solidFileUrl, configuration }) {
    this.solidFileTitle = solidFileTitle;
    this.solidFileUrl = solidFileUrl;
    this.configuration =
      configuration instanceof ApplicationConfiguration
        ? configuration
        : ApplicationConfiguration.from(configuration);
  }

  static from(json) {
    let jsonObject = json;

    if (typeof jsonObject === 'string' || jsonObject instanceof String)
      jsonObject = JSON.parse(json);

    return new ApplicationMetadata(jsonObject);
  }
}
