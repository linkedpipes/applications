/* eslint-disable */
import * as $rdf from 'rdflib';
import { Utils } from './utils';
import {
  AppConfiguration,
  SharedAppConfiguration,
  Person,
  Invitation,
  AcceptedInvitation,
  AccessControl
} from './models';
import { Log } from '@utils';
import StorageFileClient from './StorageFileClient';
import { StorageBackend } from '.';

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
const SCHEMA = $rdf.Namespace('http://schema.org/');
const ACTIVITY_STREAM = $rdf.Namespace('https://www.w3.org/ns/activitystreams');

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
    this.alreadyCheckedResources = [];
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
        force: forceReload,
        clearPreviousData: true
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
    // this.registerChanges(folder);
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
   * @param {string} folderTitle An URL of the given folder.
   * @return {Promise<boolean>} True if the folders were created, false otherwise.
   */
  async createAppFolders(webId: string, folderTitle: string): Promise<boolean> {
    const url = `${Utils.getBaseUrlConcat(webId)}`;
    const folderUrl = `${url}/${folderTitle}`;
    const configurationsUrl = `${url}/${folderTitle}`;

    try {
      await StorageFileClient.createFolder(url, folderTitle).then(success => {
        Log.info(`Created folder ${folderUrl}.`);
      });

      await StorageFileClient.updateItem(
        `${folderUrl}`,
        '.acl',
        await this.createFolderAccessList(
          webId,
          `${folderUrl}/`,
          [READ],
          true,
          null
        ),
        '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
      ).then(fileCreated => {
        Log.info(`Created access list ${folderUrl}/.acl`);
      });

      await StorageFileClient.createFolder(
        configurationsUrl,
        'configurations'
      ).then(success => {
        Log.info(`Created folder ${configurationsUrl}.`);
      });

      await StorageFileClient.updateItem(
        `${folderUrl}/configurations`,
        '.acl',
        await this.createFolderAccessList(
          webId,
          `${folderUrl}/configurations/`,
          [READ],
          true,
          null
        ),
        '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
      ).then(fileCreated => {
        Log.info(`Created access list ${folderUrl}/configurations/.acl`);
      });

      await this.updateAppFolder(webId, folderUrl).then(success => {
        Log.info(`Updated app folder in profile.`);
      });
    } catch (err) {
      Log.error(err);
      return false;
    }
    return true;
  }

  async copyFoldersRecursively(
    webId: string,
    originalFolder: string,
    destinationFolder: string
  ): Promise<boolean> {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    const copyFolderResult = await this.fetcher
      .recursiveCopy(originalFolder, destinationFolder, {
        copyACL: true,
        fetch: authClient.fetch
      })
      .then(
        res => {
          return true;
        },
        e => {
          Log.err('Error copying : ' + e);
          return false;
        }
      );

    const updateProfileLinkResult = await this.updateAppFolder(
      webId,
      destinationFolder
    ).then(success => {
      return true;
    });

    return updateProfileLinkResult && copyFolderResult;
  }

  async moveFolderRecursively(
    webId: string,
    originalFolder: string,
    destinationFolder: string
  ): Promise<boolean> {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    const copySuccess = await this.fetcher
      .recursiveCopy(originalFolder, destinationFolder, {
        copyACL: true,
        fetch: authClient.fetch
      })
      .then(
        res => {
          return true;
        },
        e => {
          Log.err('Error copying : ' + e);
          return false;
        }
      );

    const removeOldSuccess = await StorageFileClient.removeFolderContents(
      Utils.getFolderUrlFromPathUrl(originalFolder),
      Utils.getFilenameFromPathUrl(originalFolder)
    ).then(
      res => {
        return true;
      },
      e => {
        Log.err('Error copying : ' + e);
        return false;
      }
    );

    const updateProfileLinkResult = await this.updateAppFolder(
      webId,
      destinationFolder
    ).then(success => {
      return true;
    });

    return removeOldSuccess && copySuccess && updateProfileLinkResult;
  }

  /**
   * Updates a user's profile with the new application folder location.
   * @param {string} metadataUrl A url to a metadata file.
   * @param {string} newTitle New title for an application.
   * @return {boolean} True if updated, false otherwise.
   */
  async renameAppConfiguration(
    metadataUrl: string,
    newTitle: string
  ): Promise<boolean> {
    const metadataFile = $rdf.sym(metadataUrl);
    const predicate = $rdf.sym(DCT('title'));
    const title = $rdf.lit(newTitle);
    const metadata = metadataFile.doc();
    try {
      await this.load(metadata);
    } catch (err) {
      console.log('Could not load a metadata document.');
      return false;
    }
    const ins = [$rdf.st(metadataFile, predicate, title, metadata)];
    const del = this.store.statementsMatching(
      metadataFile,
      predicate,
      null,
      metadata
    );
    try {
      await this.updateResource(metadata.value, ins, del);
    } catch (err) {
      Log.error(err);
      return false;
    }
    // this.registerChanges(metadataFile);
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
    // this.registerChanges(profile);
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
    const configurationsFolder = $rdf.sym(`${folder}/configurations/`);
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
    // this.registerChanges(configurationsFolder);
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
      const response = await this.load(file);
      Log.info(response);
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
    const appConfigurationFilePath = `${appFolder}/configurations`;
    const appConfigurationFileTitle = `${Utils.getName()}`;
    let appConfigurationUrl;
    const created = new Date(Date.now());
    try {
      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.json`,
        appConfigurationFile
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
        }
      });
      const appConfigFileTtl = await this.createUploadAppConfigurationStatement(
        `${appConfigurationFilePath}/${appConfigurationFileTitle}.json.ttl`,
        `${appConfigurationFilePath}/${appConfigurationFileTitle}.json`,
        appTitle,
        appEndpoint,
        webId,
        color,
        created
      );
      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.json.ttl`,
        appConfigFileTtl
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
        }
      });
      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.json.acl`,
        await this.createFileAccessList(
          webId,
          `${appConfigurationFilePath}/${appConfigurationFileTitle}.json`,
          [READ],
          isPublic,
          allowedUsers
        )
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
        }
      });
      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.json.ttl.acl`,
        await this.createFileAccessList(
          webId,
          `${appConfigurationFilePath}/${appConfigurationFileTitle}.json.ttl`,
          [APPEND, READ],
          isPublic,
          allowedUsers
        )
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
        }
      });
    } catch (err) {
      Log.info(err);
      return Promise.reject(err);
    }
    return new AppConfiguration(
      `${appConfigurationFilePath}/${appConfigurationFileTitle}.json.ttl`,
      `${appConfigurationFilePath}/${appConfigurationFileTitle}.json`,
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
    try {
      const folderPath = `${Utils.getFolderUrlFromPathUrl(
        appConfiguration.url
      )}`;
      const metadataFileTitle = `${Utils.getFilenameFromPathUrl(
        appConfiguration.url
      )}`;
      const fileTitle = `${Utils.getFilenameFromPathUrl(
        appConfiguration.object
      )}`;

      await StorageFileClient.removeItem(folderPath, metadataFileTitle).then(
        response => {
          if (response.status === 200) {
            const filePath = response.url;
            Log.info(`Removed ${metadataFileTitle} at ${filePath}.`);
          }
        }
      );
      await StorageFileClient.removeItem(folderPath, fileTitle).then(
        response => {
          if (response.status === 200) {
            const filePath = response.url;
            Log.info(`Removed ${fileTitle} at ${filePath}.`);
          }
        }
      );
      await StorageFileClient.removeItem(
        folderPath,
        `${metadataFileTitle}.acl`
      ).then(response => {
        if (response.status === 200) {
          const filePath = response.url;
          Log.info(`Removed ${metadataFileTitle}.acl at ${filePath}.`);
        }
      });
      await StorageFileClient.removeItem(folderPath, `${fileTitle}.acl`).then(
        response => {
          if (response.status === 200) {
            const filePath = response.url;
            Log.info(`Removed ${fileTitle}.acl ${filePath}.`);
          }
        }
      );
    } catch (err) {
      console.log('Could not delete a profile document.');
      return Promise.reject(err);
    }

    return true;
  }

  /**
   * Creates appropriate RDF statements for the new application configuration to upload.
   * @param {string} appConfigurationMetadataPath An URL of the new RDF Turtle image file.
   * @param {string} appConfigurationUrl An URL of the new image file.
   * @param {string} appTitle A title of an application configuration.
   * @param {string} appEndpoint An endpoint of application configuration
   * @param {string} user A WebID of the image's creator.
   * @param {string} cardColor Color to be used for card visualizing the app
   * @param {Date} createdAt A creation date of the image.
   * @return {$rdf.Statement[]} An array of the image RDF statements.
   */
  // eslint-disable-next-line class-methods-use-this
  async createUploadAppConfigurationStatement(
    appConfigurationMetadataPath: string,
    appConfigurationUrl: string,
    appTitle: string,
    appEndpoint: string,
    user: string,
    cardColor: String,
    createdAt: Date
  ): $rdf.Statement[] {
    const appConfigFile = $rdf.sym(appConfigurationMetadataPath);
    const appConfig = $rdf.sym(appConfigurationUrl);
    const title = $rdf.lit(appTitle);
    const endpoint = $rdf.lit(appEndpoint);
    const creator = $rdf.sym(user);
    const color = $rdf.lit(cardColor);
    const doc = appConfigFile.doc();

    const fileRdf = [
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
    ]
      .join('\n')
      .toString();

    const newStore = $rdf.graph();

    $rdf.parse(fileRdf, newStore, appConfigurationMetadataPath);

    const response = await $rdf.serialize(
      null,
      newStore,
      appConfigurationMetadataPath,
      'text/turtle'
    );

    return response;
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
    const emailLd = this.store.any(user, FOAF('mbox'), null, profile);
    const email = emailLd ? emailLd.value : '';
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
  async createFolderAccessList(
    webId: string,
    folderUrl: string,
    modes: $rdf.NamedNode[],
    isPublic: boolean,
    allowedUsers: string[]
  ): $rdf.Statement[] {
    const folderAcl = this.createAccessList(
      webId,
      folderUrl,
      modes,
      isPublic,
      allowedUsers,
      true
    )
      .join('\n')
      .toString();

    const newStore = $rdf.graph();

    $rdf.parse(folderAcl, newStore, folderUrl);
    const response = await $rdf.serialize(
      null,
      newStore,
      `${folderUrl}.acl`,
      'text/turtle'
    );

    return response;
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
  async createFileAccessList(
    webId: string,
    fileUrl: string,
    modes: $rdf.NamedNode[],
    isPublic: boolean,
    allowedUsers: string[]
  ): $rdf.Statement[] {
    const fileAcl = this.createAccessList(
      webId,
      fileUrl,
      modes,
      isPublic,
      allowedUsers,
      false
    )
      .join('\n')
      .toString();

    const newStore = $rdf.graph();

    $rdf.parse(fileAcl, newStore, fileUrl);
    const response = await $rdf.serialize(
      null,
      newStore,
      `${fileUrl}.acl`,
      'text/turtle'
    );

    return response;
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

  sendFileToInbox(recipientWebId, data, type) {
    const inboxUrl = `${Utils.getBaseUrlConcat(recipientWebId)}/inbox`;
    StorageFileClient.sendFileToUrl(inboxUrl, data, type);
  }

  rejectInvitation(invitation) {
    const folderTitle = Utils.getFolderUrlFromPathUrl(invitation.invitationUrl);
    const inviteTitle = Utils.getFilenameFromPathUrl(invitation.invitationUrl);

    StorageFileClient.removeItem(folderTitle, inviteTitle).then(response => {
      if (response.status === 200) {
        Log.info(`Removed ${inviteTitle}.`);
      }
    });
  }

  async generateInvitationFile(baseUrl, metadataUrl, userWebId, opponentWebId) {
    const as = require('activitystrea.ms');

    return new Promise(resolve => {
      as.invite()
        .name('lpapps_invite')
        .actor(`${userWebId}`)
        .target(`${opponentWebId}`)
        .object(as.link().href(`${metadataUrl}`))
        .publishedNow()
        .prettyWrite((err, doc) => {
          if (err) throw err;
          resolve(doc);
        });
    });
  }

  generateResponseToInvitation(invitation, response) {
    const as = require('activitystrea.ms');
    return new Promise(resolve => {
      as.import(invitation.object, (err, invitationObject) => {
        if (err) throw err;
        else {
          as.accept()
            .name('lpapps_invite_response')
            .actor(`${invitation.recipientWebId}`)
            .target(`${invitation.senderWebId}`)
            .object(invitationObject)
            .publishedNow()
            .prettyWrite((err, doc) => {
              if (err) throw err;
              resolve(doc);
            });
        }
      });
    });
  }

  async checkSharedConfigurationsFolder(folderUrl) {
    const rdfjsSourceFromUrl = require('./utils/rdfjssourcefactory').fromUrl;
    const N3 = require('n3');
    const Q = require('q');
    const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    const deferred = Q.defer();
    const newResources = [];
    const rdfjsSource = await rdfjsSourceFromUrl(folderUrl, authClient.fetch);
    const self = this;
    const engine = newEngine();

    engine
      .query(
        `SELECT ?resource {
      ?resource a <http://www.w3.org/ns/ldp#Resource>.
    }`,
        { sources: [{ type: 'rdfjsSource', value: rdfjsSource }] }
      )
      .then(function(result) {
        result.bindingsStream.on('data', data => {
          data = data.toObject();

          const resource = data['?resource'].value;

          newResources.push(resource);
        });

        result.bindingsStream.on('end', function() {
          deferred.resolve(newResources);
        });
      });

    return deferred.promise;
  }

  async checkInboxFolder(inboxUrl) {
    const rdfjsSourceFromUrl = require('./utils/rdfjssourcefactory').fromUrl;
    const N3 = require('n3');
    const Q = require('q');
    const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    const deferred = Q.defer();
    const newResources = [];
    const rdfjsSource = await rdfjsSourceFromUrl(inboxUrl, authClient.fetch);
    const self = this;
    const engine = newEngine();

    engine
      .query(
        `SELECT ?resource { ?resource a <http://www.w3.org/ns/ldp#Resource>. }`,
        { sources: [{ type: 'rdfjsSource', value: rdfjsSource }] }
      )
      .then(function(result) {
        result.bindingsStream.on('data', data => {
          data = data.toObject();

          const resource = data['?resource'].value;

          // if (self.alreadyCheckedResources.indexOf(resource) === -1) {
          newResources.push(resource);
          self.alreadyCheckedResources.push(resource);
          // }
        });

        result.bindingsStream.on('end', function() {
          deferred.resolve(newResources);
        });
      });

    return deferred.promise;
  }

  async parseInvite(invitationUrl, userWebId) {
    const invitation = await StorageFileClient.fetchJsonLDFromUrl(
      invitationUrl
    );

    const sender = await this.getPerson(invitation.actor);
    const recipient = await this.getPerson(invitation.target);

    if (invitation.type === 'Accept') {
      return new AcceptedInvitation(
        sender,
        recipient,
        invitation,
        invitationUrl
      );
    } else {
      return new Invitation(sender, recipient, invitation, invitationUrl);
    }
  }

  async parseSharedConfiguration(configurationUrl) {
    const sharedAppConfiguration = await StorageFileClient.fetchJsonLDFromUrl(
      configurationUrl
    );

    const appMetadataUrl = sharedAppConfiguration.url;
    const appConfiguration = await this.getAppConfigurationMetadata(
      appMetadataUrl
    );

    return new SharedAppConfiguration(sharedAppConfiguration, appConfiguration);
  }

  async processAcceptSharedInvite(sharedInvitation) {
    const metadataUrl = sharedInvitation.invitation.appMetadataUrl;
    const fileMetadataFolder = Utils.getFolderUrlFromPathUrl(metadataUrl);
    const fileMetadataTitle = Utils.getFilenameFromPathUrl(metadataUrl);
    const collaboratorWebId = sharedInvitation.senderWebId;
    const webId = sharedInvitation.recipientWebId;

    const currentAccessControl = await this.fetchAccessControlFile(
      `${metadataUrl}.acl`
    );
    const collaboratorWebIds = currentAccessControl.getCollaborators();
    const isPublic = currentAccessControl.isPublic();
    if (!collaboratorWebIds.includes(collaboratorWebId)) {
      collaboratorWebIds.push(collaboratorWebId);
    }

    const accessListConfiguration = await this.createFileAccessList(
      webId,
      metadataUrl,
      [READ, WRITE],
      isPublic,
      collaboratorWebIds
    );
    await StorageFileClient.updateFile(
      `${fileMetadataFolder}/`,
      `${fileMetadataTitle}.acl`,
      accessListConfiguration,
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    ).then(fileCreated => {
      Log.info(`Created access list ${fileMetadataTitle}.acl`);
    });

    await this.removeInvitation(sharedInvitation.invitationUrl).then(
      response => {
        if (response.status === 200) {
          const filePath = response.url;
          Log.info(`Removed ${filePath}.`);
        }
      }
    );
  }

  async createSharedMetadataFromInvite(invitation) {
    const webId = invitation.recipientWebId;
    const configurationsFolderTitle = 'sharedConfigurations';

    const folderUrl = await this.getValidAppFolder(webId).catch(async error => {
      Log.error(error, 'StorageBackend');
    });

    await StorageFileClient.createFolder(
      folderUrl,
      'sharedConfigurations'
    ).then(() => {
      Log.info(`Created folder ${folderUrl}/${configurationsFolderTitle}.`);
    });

    await StorageFileClient.updateItem(
      `${folderUrl}/sharedConfigurations`,
      '.acl',
      await this.createFolderAccessList(
        webId,
        `${folderUrl}/sharedConfigurations/`,
        [READ],
        false,
        null
      ),
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    ).then(fileCreated => {
      Log.info(`Created access list ${folderUrl}/sharedConfigurations/.acl`);
    });

    const destinationPath = `${folderUrl}/${configurationsFolderTitle}`;

    const as = require('activitystrea.ms');

    const self = this;

    return new Promise(resolve => {
      as.document()
        .url(`${invitation.appMetadataUrl}`)
        .attributedTo(as.person().url(`${invitation.senderWebId}`))
        .publishedNow()
        .prettyWrite(async (err, doc) => {
          if (err) throw err;
          else {
            const uniqueFileName = `${Utils.getName()}.jsonld`;
            await StorageFileClient.createFile(
              destinationPath,
              uniqueFileName,
              doc
            );
            await StorageFileClient.createFile(
              destinationPath,
              `${uniqueFileName}.acl`,
              await self.createFileAccessList(
                webId,
                `${destinationPath}/${uniqueFileName}`,
                [READ],
                false,
                undefined
              )
            );
            resolve(true);
          }
        });
    });
  }

  async removeInvitation(invitationUrl) {
    const self = this;
    return StorageFileClient.removeItem(
      Utils.getFolderUrlFromPathUrl(invitationUrl),
      Utils.getFilenameFromPathUrl(invitationUrl)
    );
  }

  async fetchAccessControlFile(aclUrl) {
    const fetchResponse = await StorageFileClient.fetchFileFromUrl(aclUrl);
    Log.info(response);

    const newStore = $rdf.graph();

    $rdf.parse(fetchResponse, newStore, aclUrl, 'text/turtle');

    const response = await new Promise((resolve, reject) => {
      $rdf.serialize(
        null,
        newStore,
        aclUrl,
        'application/ld+json',
        async (err, data) => {
          if (err) {
            reject(err);
          }
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        }
      );
    });

    return new AccessControl(response, aclUrl);
  }

  async updateAccessControlFile(
    webId: string,
    metadataUrl: string,
    isPublic: boolean,
    contacts: Array<Person>
  ) {
    const fileMetadataFolder = Utils.getFolderUrlFromPathUrl(metadataUrl);
    const fileMetadataTitle = Utils.getFilenameFromPathUrl(metadataUrl);

    const accessListConfiguration = await this.createFileAccessList(
      webId,
      metadataUrl,
      [READ, WRITE],
      isPublic,
      contacts.map(contact => {
        return contact.webId;
      })
    );

    return await StorageFileClient.updateFile(
      `${fileMetadataFolder}/`,
      `${fileMetadataTitle}.acl`,
      accessListConfiguration,
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    ).then(fileCreated => {
      Log.info(`Updated access list ${fileMetadataTitle}.acl`);
    });
  }
}

export default new SolidBackend();
