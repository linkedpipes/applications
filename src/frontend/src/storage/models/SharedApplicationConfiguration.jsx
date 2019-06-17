import ApplicationMetadata from './ApplicationMetadata';

/**
 * Model class for storing application configuration.
 */
export default class SharedApplicationConfiguration {
  /** Url to shared application metadata */
  url: string;

  appMetadata: ApplicationMetadata;

  constructor(
    sharedAppConfiguration: Object,
    appMetadata: ApplicationMetadata
  ) {
    this.url = sharedAppConfiguration.url;
    this.appMetadata = appMetadata;
  }
}
