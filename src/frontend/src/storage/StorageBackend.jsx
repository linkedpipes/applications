/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line no-await-in-loop */
import * as $rdf from 'rdflib';
import { Utils } from './utils';
import {
  ApplicationMetadata,
  ApplicationConfiguration,
  SharedApplicationConfiguration,
  Person,
  Invitation,
  AcceptedInvitation,
  AccessControl
} from './models';
import StorageFileClient from './StorageFileClient';
import StorageSparqlClient from './StorageSparqlClient';
import { Log } from '@utils';
// eslint-disable-next-line import/newline-after-import
const rdfjsSourceFromUrl = require('./utils/rdfjssourcefactory').fromUrl;
// const N3 = require('n3');
const Q = require('q');
const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;
const as = require('activitystrea.ms');

// Definitions of the RDF namespaces.
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const SOLID = $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const DCT = $rdf.Namespace('http://purl.org/dc/terms/');
const SIOC = $rdf.Namespace('http://rdfs.org/sioc/ns#');
const XSD = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');

// Definitions of the concrete RDF node objects.
const POST = SIOC('Post');
const TIME = XSD('dateTime');
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
  store: $rdf.IndexedFormula;

  /** A fetcher responsible for fetching documents. */
  fetcher: $rdf.Fetcher;

  /** An updater responsible for updating documents. */
  updater: $rdf.UpdateManager;

  /** Flag to indicate whether fetcher requires single force reload */
  requiresForceReload: Boolean;

  constructor() {
    this.store = $rdf.graph();
    this.fetcher = new $rdf.Fetcher(this.store);
    this.updater = new $rdf.UpdateManager(this.store);
    this.alreadyCheckedResources = [];
    this.alreadyAddedDownstreamListeners = [];
    this.requiresForceReload = false;
  }

  /**
   * Fetches and loads a given document to the store.
   * @param {$rdf.NamedNode} document A given document to fetch and load.
   */
  async load(document: $rdf.NamedNode) {
    const reloadRequired = this.requiresForceReload;
    this.requiresForceReload = false;
    try {
      return this.fetcher.load(document, {
        force: reloadRequired,
        clearPreviousData: reloadRequired
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
      return this.updater.update(deletions, insertions, (uri, ok, message) => {
        if (ok) Log.info('Resource updated.', 'StorageBackend');
        else Log.warn(message);
        return Promise.resolve(message);
      });
    } catch (err) {
      return Promise.reject(new Error('Could not update the document.'));
    }
  }

  /**
   * Registers a given document for the updater to listen to the remote
   * changes of the document.
   * @param {string} URL to a given resource.
   */
  registerChanges(url: string, callbackOnRefresh: Function = undefined) {
    if (this.alreadyAddedDownstreamListeners.indexOf(url) === -1) {
      const doc = $rdf.sym(url).doc();
      this.updater.addDownstreamChangeListener(doc, callbackOnRefresh);
      this.alreadyAddedDownstreamListeners.push(url);
    }
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
    const wantedFolders = ['configurations', 'sharedConfigurations'];
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
    if (!webId.includes('#me')) {
      webId = webId.concat('#me');
    }
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
      await StorageFileClient.createFolder(url, folderTitle).then(() => {
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
      ).then(() => {
        Log.info(`Created access list ${folderUrl}/.acl`);
      });

      await StorageFileClient.createFolder(
        configurationsUrl,
        'configurations'
      ).then(() => {
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
      ).then(() => {
        Log.info(`Created access list ${folderUrl}/configurations/.acl`);
      });

      await StorageFileClient.createFolder(
        configurationsUrl,
        'sharedConfigurations'
      ).then(() => {
        Log.info(`Created folder ${configurationsUrl}.`);
      });

      await StorageFileClient.updateItem(
        `${folderUrl}/sharedConfigurations`,
        '.acl',
        await this.createFolderAccessList(
          webId,
          `${folderUrl}/sharedConfigurations/`,
          [READ],
          true,
          null
        ),
        '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
      ).then(() => {
        Log.info(`Created access list ${folderUrl}/sharedConfigurations/.acl`);
      });

      await this.updateAppFolder(webId, folderUrl).then(() => {
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
          Log.error(`Error copying : ${e}`);
          return false;
        }
      );

    const updateProfileLinkResult = await this.updateAppFolder(
      webId,
      destinationFolder
    ).then(() => {
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
        () => {
          return true;
        },
        e => {
          Log.err(`Error copying : ${e}`);
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
        Log.err(`Error copying : ${e}`);
        return false;
      }
    );

    const updateProfileLinkResult = await this.updateAppFolder(
      webId,
      destinationFolder
    ).then(() => {
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
    const sparqlQuery = `
            @prefix lpa: <https://w3id.org/def/lpapps#> .

            DELETE
            { ?configuration lpa:title ?titleValue . }
            INSERT
            { ?configuration lpa:title "${newTitle}" .}
            WHERE
            { ?configuration lpa:title ?titleValue . }
    `;

    await StorageSparqlClient.patchFileWithQuery(metadataUrl, sparqlQuery);

    try {
      await this.load($rdf.sym(metadataUrl).doc());
    } catch (err) {
      Log.error('Could not load a metadata document.', 'StorageBackend');
      return false;
    }
    return true;
  }

  async setFiltersStateEnabled(
    metadataUrl: string,
    isEnabled: Boolean
  ): Promise<boolean> {
    const sparqlQuery = `
            @prefix lpa: <https://w3id.org/def/lpapps#> .

            DELETE
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:enabled ?test . }
            INSERT
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:enabled "${
                isEnabled ? 'true' : 'false'
              }" . }
            WHERE
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:enabled ?test . }
    `;

    await StorageSparqlClient.patchFileWithQuery(metadataUrl, sparqlQuery);

    try {
      await this.load($rdf.sym(metadataUrl).doc());
    } catch (err) {
      Log.error('Could not load a metadata document.', 'StorageBackend');
      return false;
    }
    return true;
  }

  async setFiltersStateVisible(
    metadataUrl: string,
    isVisible: Boolean
  ): Promise<boolean> {
    const sparqlQuery = `
            @prefix lpa: <https://w3id.org/def/lpapps#> .

            DELETE
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:visible ?test . }
            INSERT
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:visible "${
                isVisible ? 'true' : 'false'
              }" . }
            WHERE
            { ?configuration lpa:filteredBy ?filterConfiguration .
              ?filterConfiguration lpa:visible ?test . }
    `;

    await StorageSparqlClient.patchFileWithQuery(metadataUrl, sparqlQuery);

    try {
      await this.load($rdf.sym(metadataUrl).doc());
    } catch (err) {
      Log.error('Could not load a metadata document.', 'StorageBackend');
      return false;
    }

    return true;
  }

  async setSelectedFilterOptions(
    metadataUrl: string,
    nodes: Array<Object>
  ): Promise<boolean> {
    const promises = [];

    for (const node of nodes) {
      const sparqlQuery = `
            @prefix lpa: <https://w3id.org/def/lpapps#> .

            DELETE
            { ?optionToUpdate lpa:uri "${node.uri}" .
              ?optionToUpdate lpa:selected ?optionSelected . }
            INSERT
            { ?optionToUpdate lpa:uri "${node.uri}" .
              ?optionToUpdate lpa:selected "${node.selected}" . }
            WHERE
            { ?optionToUpdate lpa:uri "${node.uri}" .
              ?optionToUpdate lpa:selected ?optionSelected . }
    `;
      promises.push(
        StorageSparqlClient.patchFileWithQuery(metadataUrl, sparqlQuery)
      );
    }

    await Promise.all(promises);

    try {
      await this.load($rdf.sym(metadataUrl).doc());
    } catch (err) {
      Log.error('Could not load a metadata document.', 'StorageBackend');
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
      Log.error('Could not load a profile document.', 'StorageBackend');
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
      Log.error(err, 'StorageBackend');
      return [];
    }
    if (!folder) return [];
    const configurationsMetadata = [];
    const configurationsFolder = $rdf.sym(`${folder}/configurations/`);
    try {
      await this.load(configurationsFolder);
    } catch (err) {
      Log.error(err, 'StorageBackend');
      return [];
    }
    const files = this.store.each(
      configurationsFolder,
      LDP('contains'),
      null,
      configurationsFolder
    );

    const promises = [];

    for (const file of files) {
      if (String(file.value).endsWith('.ttl')) {
        promises.push(
          this.getAppConfigurationMetadata(file.value)
            .then(appConfigMetadata => {
              configurationsMetadata.push(appConfigMetadata);
            })
            .catch(err => Log.error(err, 'StorageBackend'))
        );
      }
    }

    await Promise.all(promises);

    return configurationsMetadata.sort((a, b) =>
      Utils.sortByDateAsc(a.configuration.published, b.configuration.published)
    );
  }

  /**
   * Fetches a single image.
   * @param {string} url An URL of the given image.
   * @return {Promise<ApplicationMetadata>} Fetched image.
   */
  async getAppConfigurationMetadata(
    url: string,
    callbackOnRefresh: Function = undefined,
    forceReload: Boolean = false
  ): Promise<ApplicationMetadata> {
    const fileUrl = $rdf.sym(url);
    const file = fileUrl.doc();

    try {
      if (forceReload) {
        this.requiresForceReload = forceReload;
      }
      await this.load(file);
    } catch (err) {
      return Promise.reject(err);
    }

    const type = this.store.match(
      fileUrl,
      RDF('type'),
      LPA('VisualizerConfiguration'),
      file
    );

    if (type) {
      const applicationConfiguration = ApplicationConfiguration.fromTurtle(
        this.store,
        fileUrl,
        file
      );

      const appConfigurationFileTitle = `${Utils.getFilenameFromPathUrl(url)}`;
      const appConfigurationFullPath = url;

      this.registerChanges(url, callbackOnRefresh);

      return ApplicationMetadata.from({
        solidFileTitle: appConfigurationFileTitle,
        solidFileUrl: appConfigurationFullPath,
        configuration: applicationConfiguration
      });
    }

    return Promise.reject(new Error('Configuration not found!'));
  }

  /**
   * Uploads a new image to the user's POD.
   * @param {Object} applicationConfiguration Partially constructed jsonld configuration.
   * @param {string} appFolder An application folder of the application's creator.
   * @param {string} webId A WebID of the image's creator.
   * @return {Promise<ApplicationConfiguration>} Uploaded image.
   */
  async uploadApplicationConfiguration(
    applicationConfiguration: ApplicationConfiguration,
    appFolder,
    webId
  ): Promise<ApplicationMetadata> {
    const appConfigurationFilePath = `${appFolder}/configurations`;
    const appConfigurationFileTitle = `${Utils.getName()}`;
    const appConfigurationFullPath = `${appConfigurationFilePath}/${appConfigurationFileTitle}.ttl`;
    const applicationConfigurationTurtle = await applicationConfiguration.toTurtle(
      appConfigurationFullPath
    );

    $rdf.parse(
      applicationConfigurationTurtle,
      this.store,
      appConfigurationFullPath
    );

    Log.info(applicationConfigurationTurtle, 'StorageBackend');

    try {
      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.ttl`,
        applicationConfigurationTurtle
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
          this.load($rdf.sym(appConfigurationFullPath).doc());
        }
      });

      await StorageFileClient.createFile(
        appConfigurationFilePath,
        `${appConfigurationFileTitle}.ttl.acl`,
        await this.createFileAccessList(
          webId,
          appConfigurationFullPath,
          [READ],
          true,
          []
        )
      ).then(response => {
        if (response.status === 201) {
          const filePath = response.url;
          Log.info(`Created file at ${filePath}.`);
        }
      });

      this.requiresForceReload = true;

      return Promise.resolve(
        ApplicationMetadata.from({
          solidFileTitle: appConfigurationFileTitle,
          solidFileUrl: appConfigurationFullPath,
          configuration: applicationConfiguration
        })
      );
    } catch (err) {
      Log.info(err);
      return Promise.reject(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeApplicationConfiguration(
    appFolder: string,
    appMetadata: ApplicationMetadata
  ): Promise<Boolean> {
    try {
      const folderPath = `${Utils.getFolderUrlFromPathUrl(
        appMetadata.solidFileUrl
      )}`;
      const metadataFileTitle = appMetadata.solidFileTitle;

      await StorageFileClient.removeItem(folderPath, metadataFileTitle).then(
        response => {
          if (response.status === 200) {
            const filePath = response.url;
            Log.info(`Removed ${metadataFileTitle} at ${filePath}.`);
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
    } catch (err) {
      Log.error('Could not delete a profile document.', 'StorageBackend');
      return Promise.reject(err);
    }

    return true;
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
      Log.error('Could not load a profile document.', 'StorageBackend');
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
    // const emailLd = this.store.any(user, FOAF('mbox'), null, profile);
    // const email = emailLd ? emailLd.value : '';
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

    const promises = [];

    for (const value of userIds) {
      promises.push(
        this.getPerson(value)
          .then(person => {
            users.push(person);
          })
          .catch(err => Log.error(err, 'StorageBackend'))
      );
    }

    await Promise.all(promises);

    return users.flat();
  }

  /**
   * Fetches personal data of the given user's friends'.
   * @param {string} webId A user's WebID.
   * @return {Promise<Person[]>} Fetched persons.
   */
  async getFriends(webId: string): Promise<Person[]> {
    const friendsIds = await this.getFriendsWebId(webId);
    return this.getPersons(friendsIds);
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
        const friendWebId = $rdf.sym(userId);
        acl = acl.concat(
          this.createAccessStatement(
            userGroup,
            resource,
            friendWebId,
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
      return Promise.resolve('Resource updated!');
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

  async generateInvitationFile(metadataUrl, userWebId, opponentWebId) {
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
            .prettyWrite((writeError, doc) => {
              if (writeError) throw writeError;
              resolve(doc);
            });
        }
      });
    });
  }

  async checkSharedConfigurationsFolder(folderUrl) {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    const deferred = Q.defer();
    const newResources = [];
    const rdfjsSource = await rdfjsSourceFromUrl(folderUrl, authClient.fetch);
    const engine = newEngine();

    engine
      .query(
        `SELECT ?resource {
      ?resource a <http://www.w3.org/ns/ldp#Resource>.
    }`,
        { sources: [{ type: 'rdfjsSource', value: rdfjsSource }] }
      )
      .then(result => {
        result.bindingsStream.on('data', data => {
          data = data.toObject();

          const resource = data['?resource'].value;

          newResources.push(resource);
        });

        result.bindingsStream.on('end', () => {
          deferred.resolve(newResources);
        });
      });

    return deferred.promise;
  }

  async checkInboxFolder(inboxUrl) {
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
      .then(result => {
        result.bindingsStream.on('data', data => {
          data = data.toObject();

          const resource = data['?resource'].value;

          // if (self.alreadyCheckedResources.indexOf(resource) === -1) {
          newResources.push(resource);
          self.alreadyCheckedResources.push(resource);
          // }
        });

        result.bindingsStream.on('end', () => {
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
    }
    return new Invitation(sender, recipient, invitation, invitationUrl);
  }

  async parseSharedConfiguration(configurationUrl) {
    const sharedAppConfiguration = await StorageFileClient.fetchJsonLDFromUrl(
      configurationUrl
    );

    const appMetadataUrl = sharedAppConfiguration.url;
    const appMetadata = await this.getAppConfigurationMetadata(appMetadataUrl);

    return new SharedApplicationConfiguration(
      sharedAppConfiguration,
      appMetadata
    );
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
    ).then(() => {
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

    const destinationPath = `${folderUrl}/${configurationsFolderTitle}`;

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
    return StorageFileClient.removeItem(
      Utils.getFolderUrlFromPathUrl(invitationUrl),
      Utils.getFilenameFromPathUrl(invitationUrl)
    );
  }

  async fetchAccessControlFile(aclUrl) {
    const fetchResponse = await StorageFileClient.fetchFileFromUrl(aclUrl, {
      Accept: 'application/ld+json'
    });

    const response = JSON.parse(fetchResponse)

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

    return StorageFileClient.updateFile(
      `${fileMetadataFolder}/`,
      `${fileMetadataTitle}.acl`,
      accessListConfiguration,
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    ).then(() => {
      Log.info(`Updated access list ${fileMetadataTitle}.acl`);
    });
  }
}

export default new SolidBackend();
