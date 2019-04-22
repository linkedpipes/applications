/* eslint-disable */
import * as $rdf from 'rdflib';
import { Utils } from './utils';
import { AppConfiguration } from './models';
import { Log } from '@utils';

// Definitions of the RDF namespaces.
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const SOLID = $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const DCT = $rdf.Namespace('http://purl.org/dc/terms/');
const SIOC = $rdf.Namespace('http://rdfs.org/sioc/ns#');
const XSD = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
const AS = $rdf.Namespace('https://www.w3.org/ns/activitystreams#');

// Definitions of the concrete RDF node objects.
const POST = SIOC('Post');
const TIME = XSD('dateTime');
const LIKE = AS('Like');
const COMMENT = AS('Note');
const CONTROL = ACL('Control');
const READ = ACL('Read');
const WRITE = ACL('Write');
const APPEND = ACL('Append');

/**
 * Service class responsible for fetching, updating, and creating
 * the resources from/to the Solid POD.
 */
class SolidBackend {
  /** A store graph used to store the fetched/created/updated documents. */
  _store: $rdf.IndexedFormula;

  /** A fetcher responsible for fetching documents. */
  _fetcher: $rdf.Fetcher;

  /** An updater responsible for updating documents. */
  _updater: $rdf.UpdateManager;

  constructor() {
    this._store = $rdf.graph();
    this._fetcher = new $rdf.Fetcher(this.store);
    this._updater = new $rdf.UpdateManager(this.store);
  }

  set store(store) {
    this._store = store;
  }

  set fetcher(fetcher) {
    this._fetcher = fetcher;
  }

  set updater(updater) {
    this._updater = updater;
  }

  get store() {
    return this._store;
  }

  get fetcher() {
    return this._fetcher;
  }

  get updater() {
    return this._updater;
  }

  /**
   * Fetches and loads a given document to the store.
   * @param {$rdf.NamedNode} document A given document to fetch and load.
   */
  async load(document: $rdf.NamedNode, forceReload = true) {
    try {
      return await this.fetcher.load(document, {
        force: forceReload
      });
    } catch (err) {
      return Promise.reject(new Error('Could not fetch the document.'));
    }
  }

  /**
   * Updates the involving documents with given insertions and deletions.
   * @param {$rdf.Statement[]} deletions Statements to delete.
   * @param {$rdf.Statement[]} insertions Statements to insert.
   */
  async update(deletions: $rdf.Statement[], insertions: $rdf.Statement[]) {
    try {
      await this.updater.update(
        deletions,
        insertions,
        (uri, ok, message, response) => {
          if (ok) console.log('Resource updated.');
          else console.log(message);
        }
      );
    } catch (err) {
      return Promise.reject(new Error('Could not update the document.'));
    }
  }

  /**
   * Registers a given document for the updater to listen to the remote
   * changes of the document.
   * @param {$rdf.NamedNode} document A given document to register.
   */
  registerChanges(document: $rdf.NamedNode) {
    // this.updater.addDownstreamChangeListener(document, () => {});
  }

  /**
   * Gets a user's application folder.
   * @param {string} webId A user's WebID.
   * @return {Promise<string>} The user's application folder.
   */
  async getAppFolder(webId: string): Promise<string> {
    const user = $rdf.sym(webId);
    const doc = user.doc();
    try {
      await this.load(doc);
    } catch (err) {
      return Promise.reject(err);
    }
    const folder = this.store.any(user, SOLID('timeline'), null, doc);
    return folder
      ? folder.value.toString()
      : Promise.reject(new Error('No application folder.'));
  }

  /**
   * Determines whether a given application folder is valid.
   * @param {string} folderUrl An URL of the given folder.
   * @return {boolean} True if application folder is valid, false otherwise.
   */
  async isValidAppFolder(folderUrl: string): Promise<boolean> {
    const folder = $rdf.sym(folderUrl).doc();
    try {
      await this.load(folder);
    } catch (err) {
      return Promise.reject(err);
    }
    const wantedFolders = ['configurations'];
    const subFolders = this.store
      .match(null, $rdf.sym(RDF('type')), $rdf.sym(LDP('Container')), folder)
      .map(st => st.subject.value)
      .filter(subFolder => {
        return (
          subFolder !== folderUrl &&
          wantedFolders.indexOf(Utils.getLastUrlSegment(subFolder)) !== -1
        );
      });
    this.registerChanges(folder);
    return subFolders.length >= 1;
  }

  /**
   * Gets a valid user's application folder.
   * @param {string} webId A user's WebID.
   * @return {Promise<string>} The user's valid application folder.
   */
  async getValidAppFolder(webId: string): Promise<string> {
    try {
      const folder = await this.getAppFolder(webId);
      if (folder) {
        const valid = await this.isValidAppFolder(folder);
        if (valid) {
          return folder;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.reject(new Error('No valid application folder.'));
  }

  /**
   * Creates appropriate application folders on the user's POD.
   * @param {string} webId A user's WebID.
   * @param {string} folderUrl An URL of the given folder.
   * @return {Promise<boolean>} True if the folders were created, false otherwise.
   */
  async createAppFolders(webId: string, folderUrl: string): Promise<boolean> {
    const configurationsUrl = `${folderUrl}configurations/`;
    try {
      const fileClient = await import(
        /* webpackChunkName: "solid-file-client" */ 'solid-file-client'
      );

      await fileClient.createFolder(folderUrl).then(success => {
        console.log(`Created folder ${folderUrl}.`);
      });
      await fileClient.createFolder(configurationsUrl).then(success => {
        console.log(`Created folder ${configurationsUrl}.`);
      });
      await fileClient
        .updateFile(
          `${folderUrl}.acl`,
          this.createFolderAccessList(webId, folderUrl, [READ], true, null)
            .join('\n')
            .toString()
        )
        .then(fileCreated => {
          console.log(`Created access list ${fileCreated}.`);
        });
      await this.updateAppFolder(webId, folderUrl).then(success => {
        console.log(`Updated app folder in profile.`);
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  /**
   * Updates a user's profile with the new application folder location.
   * @param {string} webId A user's WebID.
   * @param {string} folderUrl An URL of the new application folder.
   * @return {boolean} True if updated, false otherwise.
   */
  async updateAppFolder(webId: string, folderUrl: string): Promise<boolean> {
    const user = $rdf.sym(webId);
    const predicate = $rdf.sym(SOLID('timeline'));
    const folder = $rdf.sym(folderUrl);
    const profile = user.doc();
    try {
      await this.load(profile);
    } catch (err) {
      console.log('Could not load a profile document.');
      return false;
    }
    const ins = [$rdf.st(user, predicate, folder, profile)];
    const del = this.store.statementsMatching(user, predicate, null, profile);
    try {
      await this.updateResource(profile.value, ins, del);
    } catch (err) {
      return false;
    }
    this.registerChanges(profile);
    return true;
  }

  /**
   * Fetches images posted by the given user from his POD.
   * @param {string} webId A user's WebID.
   * @param {string} appFolder An URL of the user's application folder.
   * @return {Promise<Image[]>} An array of user's images sorted by date (newest to oldest).
   */
  async getAppConfigurationsMetadata(
    webId: string,
    appFolder: string
  ): Promise<ApplicationConfiguration[]> {
    let folder;
    try {
      folder = appFolder || (await this.getValidAppFolder(webId));
    } catch (err) {
      console.log(err);
      return [];
    }
    if (!folder) return [];
    const configurationsMetadata = [];
    const configurationsFolder = $rdf.sym(`${folder}configurations/`);
    try {
      await this.load(configurationsFolder);
    } catch (err) {
      console.log(err);
      return [];
    }
    const files = this.store.each(
      configurationsFolder,
      LDP('contains'),
      null,
      configurationsFolder
    );
    for (const i in files) {
      if (String(files[i].value).endsWith('.ttl')) {
        await this.getAppConfigurationMetadata(files[i].value)
          .then(appConfigMetadata => {
            configurationsMetadata.push(appConfigMetadata);
          })
          .catch(err => console.log(err));
      }
    }
    this.registerChanges(configurationsFolder);
    return configurationsMetadata.sort((a, b) =>
      Utils.sortByDateAsc(a.createdAt, b.createdAt)
    );
  }

  /**
   * Fetches a single image.
   * @param {string} url An URL of the given image.
   * @return {Promise<AppConfiguration>} Fetched image.
   */
  async getAppConfigurationMetadata(url: string): Promise<AppConfiguration> {
    const fileUrl = $rdf.sym(url);
    const file = fileUrl.doc();
    try {
      await this.load(file);
    } catch (err) {
      return Promise.reject(err);
    }
    const type = this.store.match(fileUrl, RDF('type'), POST, file);
    if (type) {
      const configurationUrl = this.store.any(
        fileUrl,
        FOAF('depiction'),
        null,
        file
      );
      const title = this.store.any(fileUrl, DCT('title'), null, file);
      const endpoint = this.store.any(fileUrl, DCT('identifier'), null, file);
      const creator = this.store.any(fileUrl, DCT('creator'), null, file);
      const color = this.store.any(fileUrl, VCARD('label'), null, file);
      const created = this.store.any(fileUrl, DCT('created'), null, file);
      return new AppConfiguration(
        url.toString(),
        configurationUrl.value,
        title.value,
        endpoint.value,
        creator.value,
        color.value,
        new Date(created.value)
      );
    }
    return Promise.reject(new Error('App configuration not found.'));
  }

  /**
   * Uploads a new image to the user's POD.
   * @param {string} appConfigurationFile An app file data.
   * @param {string} webId A WebID of the image's creator.
   * @param {string} appFolder An application folder of the application's creator.
   * @param {boolean} isPublic Whether the image is public or private.
   * @param {string} color Color for application card.
   * @param {string[]} allowedUsers An array of the user's which are allowed to access the application.
   * @return {Promise<ApplicationConfiguration>} Uploaded image.
   */
  async uploadAppConfiguration(
    appConfigurationFile: File,
    appTitle: string,
    appEndpoint: string,
    webId: string,
    appFolder: string,
    isPublic: boolean,
    color: string,
    allowedUsers: string[]
  ): Promise<AppConfiguration> {
    const appConfigName = `${appFolder}configurations/${Utils.getName()}.json`;
    let appConfigFileUrl = `${appConfigName}.ttl`;
    let appConfigUrl;
    const created = new Date(Date.now());
    try {
      const fileClient = await import(
        /* webpackChunkName: "solid-file-client" */ 'solid-file-client'
      );

      await fileClient
        .createFile(appConfigName, appConfigurationFile)
        .then(fileCreated => {
          Log.info(`Created image ${fileCreated}.`);
          appConfigUrl = fileCreated;
        });
      const appConfigFileTtl = this.createUploadAppConfigurationStatement(
        appConfigFileUrl,
        appConfigUrl,
        appTitle,
        appEndpoint,
        webId,
        color,
        created
      );
      await fileClient
        .createFile(appConfigFileUrl, appConfigFileTtl.join('\n').toString())
        .then(fileCreated => {
          Log.info(`Created image data ${fileCreated}.`);
          appConfigFileUrl = fileCreated;
        });
      await fileClient
        .createFile(
          `${appConfigUrl}.acl`,
          this.createFileAccessList(
            webId,
            appConfigUrl,
            [READ],
            isPublic,
            allowedUsers
          )
            .join('\n')
            .toString()
        )
        .then(fileCreated => {
          Log.info(`Created access list ${fileCreated}.`);
        });
      await fileClient
        .createFile(
          `${appConfigFileUrl}.acl`,
          this.createFileAccessList(
            webId,
            appConfigFileUrl,
            [APPEND, READ],
            isPublic,
            allowedUsers
          )
            .join('\n')
            .toString()
        )
        .then(fileCreated => {
          Log.info(`Created access list ${fileCreated}.`);
        });
    } catch (err) {
      Log.info(err);
      return Promise.reject(err);
    }
    return new AppConfiguration(
      appConfigFileUrl,
      appConfigUrl,
      appTitle,
      appEndpoint,
      webId,
      color,
      created
    );
  }

  async removeAppConfiguration(
    appFolder: string,
    appConfiguration: AppConfiguration
  ): Promise<Boolean> {
    const fileClient = await import(
      /* webpackChunkName: "solid-file-client" */ 'solid-file-client'
    );

    await this.fetcher.webOperation('DELETE', appConfiguration.url).then(
      () => {
        Log.info(`Removed file!`);
      },
      err => {
        return false;
      }
    );

    await this.fetcher.webOperation('DELETE', appConfiguration.object).then(
      () => {
        Log.info(`Removed file!`);
      },
      err => {
        return false;
      }
    );

    await this.fetcher
      .webOperation('DELETE', `${appConfiguration.object}.acl`)
      .then(
        () => {
          Log.info(`Removed file!`);
        },
        err => {
          return false;
        }
      );

    await this.fetcher
      .webOperation('DELETE', `${appConfiguration.url}.acl`)
      .then(
        () => {
          Log.info(`Removed file!`);
        },
        err => {
          return false;
        }
      );

    const folder = $rdf.sym(appFolder).doc();

    return true;
  }

  /**
   * Creates appropriate RDF statements for the new application configuration to upload.
   * @param {string} appConfigFileUrl An URL of the new RDF Turtle image file.
   * @param {string} appConfigUrl An URL of the new image file.
   * @param {string} appTitle A title of an application configuration.
   * @param {string} appEndpoint An endpoint of application configuration
   * @param {string} user A WebID of the image's creator.
   * @param {string} cardColor Color to be used for card visualizing the app
   * @param {Date} createdAt A creation date of the image.
   * @return {$rdf.Statement[]} An array of the image RDF statements.
   */
  // eslint-disable-next-line class-methods-use-this
  createUploadAppConfigurationStatement(
    appConfigFileUrl: string,
    appConfigUrl: string,
    appTitle: string,
    appEndpoint: string,
    user: string,
    cardColor: String,
    createdAt: Date
  ): $rdf.Statement[] {
    const appConfigFile = $rdf.sym(appConfigFileUrl);
    const appConfig = $rdf.sym(appConfigUrl);
    const title = $rdf.lit(appTitle);
    const endpoint = $rdf.lit(appEndpoint);
    const creator = $rdf.sym(user);
    const color = $rdf.lit(cardColor);
    const doc = appConfigFile.doc();
    return [
      $rdf.st(appConfigFile, RDF('type'), SIOC('Post'), doc),
      $rdf.st(appConfigFile, FOAF('depiction'), appConfig, doc),
      $rdf.st(appConfigFile, DCT('title'), title, doc),
      $rdf.st(appConfigFile, DCT('identifier'), endpoint, doc),
      $rdf.st(appConfigFile, DCT('creator'), creator, doc),
      $rdf.st(appConfigFile, VCARD('label'), color, doc),
      $rdf.st(
        appConfigFile,
        DCT('created'),
        $rdf.lit(createdAt.toISOString(), null, TIME),
        doc
      )
    ];
  }

  /**
   * Creates appropriate RDF statements for the new image to upload.
   * @param {string} imageFileUrl An URL of the new RDF Turtle image file.
   * @param {string} imageUrl An URL of the new image file.
   * @param {string} imageDescription A description of the new image.
   * @param {string} user A WebID of the image's creator.
   * @param {Date} createdAt A creation date of the image.
   * @return {$rdf.Statement[]} An array of the image RDF statements.
   */
  createUploadImageStatement(
    imageFileUrl: string,
    imageUrl: string,
    imageDescription: string,
    user: string,
    createdAt: Date
  ): $rdf.Statement[] {
    const imageFile = $rdf.sym(imageFileUrl);
    const image = $rdf.sym(imageUrl);
    const desc = $rdf.lit(imageDescription);
    const creator = $rdf.sym(user);
    const doc = imageFile.doc();
    return [
      $rdf.st(imageFile, RDF('type'), SIOC('Post'), doc),
      $rdf.st(imageFile, FOAF('depiction'), image, doc),
      $rdf.st(imageFile, DCT('description'), desc, doc),
      $rdf.st(imageFile, DCT('creator'), creator, doc),
      $rdf.st(
        imageFile,
        DCT('created'),
        $rdf.lit(createdAt.toISOString(), null, TIME),
        doc
      )
    ];
  }

  /**
   * Fetches WebIDs of the user's friends from his POD.
   * @param {string} webId A WebID of the user.
   * @return {Promise<string>} WebIDs of the user's friends.
   */
  async getFriendsWebId(webId: string): Promise<string[]> {
    const user = $rdf.sym(webId);
    const doc = user.doc();
    try {
      await this.load(doc);
    } catch (err) {
      console.log('Could not load a profile document.');
      return Promise.reject(err);
    }
    return this.store
      .each(user, FOAF('knows'), null, doc)
      .map(friend => friend.value);
  }

  /**
   * Fetches a single person.
   * @param {string} webId A person's WebID.
   * @return {Person} Fetched person.
   */
  async getPerson(webId: string): Promise<Person> {
    const user = $rdf.sym(webId);
    const profile = user.doc();
    try {
      await this.load(profile);
    } catch (err) {
      return Promise.reject(err);
    }
    const nameLd = this.store.any(user, FOAF('name'), null, profile);
    const name = nameLd ? nameLd.value : '';
    let imageLd = this.store.any(user, FOAF('img'), null, profile);
    imageLd = imageLd || this.store.any(user, VCARD('hasPhoto'), null, profile);
    const image = imageLd ? imageLd.value : '/img/icon/empty-profile.svg';
    return new Person(webId, name, image);
  }

  /**
   * Fetches personal data of the given persons from their PODs.
   * @param {string[]} userIds WebIDs of the persons to be fetched.
   * @return {Promise<Person[]>} Fetched persons.
   */
  async getPersons(userIds: string[]): Promise<Person[]> {
    const users = [];
    for (const i in userIds) {
      await this.getPerson(userIds[i])
        .then(person => {
          users.push(person);
        })
        .catch(err => console.log(err));
    }
    return users.flat();
  }

  /**
   * Fetches personal data of the given user's friends'.
   * @param {string} webId A user's WebID.
   * @return {Promise<Person[]>} Fetched persons.
   */
  async getFriends(webId: string): Promise<Person[]> {
    const friendsIds = await this.getFriendsWebId(webId);
    return await this.getPersons(friendsIds);
  }

  /**
   * Fetches images posted by the given user's friends from their PODs.
   * @param {string} webId A user's WebID.
   * @return {Promise<Image[]>} An array of user's friends' images sorted by date (newest to oldest).
   */
  async getFriendsImages(webId: string): Promise<string[]> {
    const friendsIds = await this.getFriendsWebId(webId);
    const images = await Promise.all(
      friendsIds.map(friendId => this.getImages(friendId))
    );
    return images
      .flat()
      .sort((a, b) => Utils.sortByDateAsc(a.createdAt, b.createdAt));
  }

  /**
   * Creates appropriate RDF statements for the access list for the given folder.
   * @param {string} webId A WebID of the user.
   * @param {string} folderUrl An URL of the folder.
   * @param {$rdf.NamedNode[]} modes Access List modes (READ, WRITE, etc.).
   * @param {boolean} isPublic Whether the folder is public or private.
   * @param {string[]} allowedUsers An array of the user's which are allowed to access the folder.
   * @return {$rdf.Statement[]} An array of the access list RDF statements.
   */
  createFolderAccessList(
    webId: string,
    folderUrl: string,
    modes: $rdf.NamedNode[],
    isPublic: boolean,
    allowedUsers: string[]
  ): $rdf.Statement[] {
    return this.createAccessList(
      webId,
      folderUrl,
      modes,
      isPublic,
      allowedUsers,
      true
    );
  }

  /**
   * Creates appropriate RDF statements for the access list for the given file.
   * @param {string} webId A WebID of the user.
   * @param {string} fileUrl An URL of the file.
   * @param {$rdf.NamedNode[]} modes Access List modes (READ, WRITE, etc.).
   * @param {boolean} isPublic Whether the file is public or private.
   * @param {string[]} allowedUsers An array of the user's which are allowed to access the file.
   * @return {$rdf.Statement[]} An array of the access list RDF statements.
   */
  createFileAccessList(
    webId: string,
    fileUrl: string,
    modes: $rdf.NamedNode[],
    isPublic: boolean,
    allowedUsers: string[]
  ): $rdf.Statement[] {
    return this.createAccessList(
      webId,
      fileUrl,
      modes,
      isPublic,
      allowedUsers,
      false
    );
  }

  /**
   * Creates appropriate RDF statements for the access list for the given resource.
   * @param {string} webId A WebID of the user.
   * @param {string} resourceUrl An URL of the resource.
   * @param {$rdf.NamedNode[]} modes Access List modes (READ, WRITE, etc.).
   * @param {boolean} isPublic Whether the resource is public or private.
   * @param {string[]} allowedUsers An array of the user's which are allowed to access the resource.
   * @param {boolean} isFolder Whether the resource is a folder or a file.
   * @return {$rdf.Statement[]} An array of the access list RDF statements.
   */
  createAccessList(
    webId: string,
    resourceUrl: string,
    modes: $rdf.NamedNode[],
    isPublic: boolean,
    allowedUsers: string[],
    isFolder: boolean
  ): $rdf.Statement[] {
    const resource = $rdf.sym(resourceUrl);
    const accessListUrl = `${resourceUrl}.acl`;
    const doc = $rdf.sym(accessListUrl);
    const user = $rdf.sym(webId);
    const owner = $rdf.sym(`${accessListUrl}#owner`);
    let acl = this.createAccessStatement(owner, resource, user, isFolder, doc, [
      CONTROL,
      READ,
      WRITE
    ]);
    if (isPublic === true) {
      const publicGroup = $rdf.sym(`${accessListUrl}#public`);
      acl = acl.concat(
        this.createAccessStatement(
          publicGroup,
          resource,
          null,
          isFolder,
          doc,
          modes
        )
      );
    } else if (allowedUsers) {
      allowedUsers.forEach(userId => {
        const userGroup = $rdf.sym(accessListUrl);
        const user = $rdf.sym(userId);
        acl = acl.concat(
          this.createAccessStatement(
            userGroup,
            resource,
            user,
            isFolder,
            doc,
            modes
          )
        );
      });
    }
    return acl;
  }

  /**
   * Creates appropriate RDF statements for the access list for the given resource and user group.
   * @param {$rdf.NamedNode} groupNode A user group node to be used in an Access list.
   * @param {$rdf.NamedNode} resource A node containing an URL of the resource.
   * @param {$rdf.NamedNode} user A node containing the WebID of the user.
   * @param {boolean} isFolder Whether the resource is a folder or a file.
   * @param {$rdf.NamedNode} doc A node containing an URL of the Access list.
   * @param {$rdf.NamedNode[]} modes Access List modes (READ, WRITE, etc.).
   * @return {$rdf.Statement[]} An array of the access list group RDF statements.
   */
  createAccessStatement(
    groupNode: $rdf.NamedNode,
    resource: $rdf.NamedNode,
    user: $rdf.NamedNode,
    isFolder: boolean,
    doc: $rdf.NamedNode,
    modes: $rdf.NamedNode[]
  ): $rdf.Statement[] {
    const acl = [
      $rdf.st(groupNode, RDF('type'), ACL('Authorization'), doc),
      $rdf.st(groupNode, ACL('accessTo'), resource, doc)
    ];
    if (user) {
      acl.push($rdf.st(groupNode, ACL('agent'), user, doc));
    } else {
      acl.push($rdf.st(groupNode, ACL('agentClass'), FOAF('Agent'), doc));
    }
    modes.forEach(mode => {
      acl.push($rdf.st(groupNode, ACL('mode'), mode, doc));
    });
    if (isFolder === true) {
      acl.push($rdf.st(groupNode, ACL('defaultForNew'), resource, doc));
    }
    return acl;
  }

  /**
   * Updates a given resource with the given deletion and insertion statements.
   * @param {string} resourceUrl An URL of the resource to be updated.
   * @param {$rdf.Statement[]} insertions Statements to insert.
   * @param {$rdf.Statement[]} deletions Statements to delete.
   * @return {Promise<void>} void
   */
  async updateResource(
    resourceUrl: string,
    insertions: $rdf.Statement[],
    deletions: $rdf.Statement[]
  ): Promise<void> {
    const resource = $rdf.sym(resourceUrl);
    try {
      await this.load(resource);
      await this.update(deletions, insertions);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new SolidBackend();
