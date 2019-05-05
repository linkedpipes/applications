/**
 * Model class for storing person's information.
 */
export default class Person {
  /** A WebID of the person. */
  webId: string;

  /** Person's name. */
  name: string;

  /** Person's profile image. */
  image: string;

  constructor(webId: string, name: string, image: string) {
    this.webId = webId;
    this.name = name;
    this.image = image;
  }
}
