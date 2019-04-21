/**
 * Model class for storing application configuration.
 */
export default class AppConfiguration {
  /** An URL of the metadata RDF Turtle (.ttl) file. */
  url: string;

  /** An URL of the object the configuration (.json). */
  object: string;

  /** A WebID of the creator of the application configuration. */
  creator: string;

  /** A date of the creation of the application configuration. */
  createdAt: Date;

  /** A text of the application's description */
  title: string;

  /** A text of the application's endpoint */
  endpoint: string;

  /** Used to assing individual random color to visualizer */
  cardColor: string;

  constructor(
    url: string,
    object: string,
    title: string,
    endpoint: String,
    creator: string,
    cardColor: string,
    createdAt: Date
  ) {
    this.url = url;
    this.object = object;
    this.title = title;
    this.endpoint = endpoint;
    this.creator = creator;
    this.cardColor = cardColor;
    this.createdAt = createdAt;
  }
}
