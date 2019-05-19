/**
 * Model class for storing application configuration.
 */
export default class SharedAppConfiguration {
  /** Url to shared application metadata */
  url: string;

  constructor(sharedAppConfiguration: Object) {
    this.url = sharedAppConfiguration.url;
  }
}
