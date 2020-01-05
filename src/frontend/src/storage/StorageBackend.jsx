/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line no-await-in-loop */
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
import StorageSparqlClient from './StorageSparqlClient';
import {
  StorageFileManager,
  SolidResourceType,
  StorageAuthenticationManager,
  AccessControlNamespace,
  ResourceConfig,
  StorageRdfManager,
  AccessControlConfig,
  rdflib as $rdf
} from 'linkedpipes-storage';
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
      this.requiresForceReload = true;
      await this.load(doc);
    } catch (err) {
      return Promise.reject(err);
    }
    const folder = this.store.any(user, LPA('lpStorage'), null, doc);
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
    const configurationsUrl = `${url}/${folderTitle}/configurations`;
    const sharedConfigurationsUrl = `${url}/${folderTitle}/sharedConfigurations`;

    try {
      const resourceConfig: ResourceConfig = new ResourceConfig(
        { path: url, title: folderTitle, type: SolidResourceType.Folder },
        webId
      );

      await StorageFileManager.createResource(resourceConfig).then(
        async response => {
          Log.info(response);

          const resourceConfigACL = new AccessControlConfig(
            resourceConfig.resource,
            [],
            resourceConfig.webID
          );

          await StorageFileManager.updateACL(resourceConfigACL);
        }
      );

      const configurationsFolderConfig: ResourceConfig = new ResourceConfig(
        {
          path: `${url}/${folderTitle}`,
          title: 'configurations',
          type: SolidResourceType.Folder
        },
        webId
      );

      await StorageFileManager.createResource(configurationsFolderConfig).then(
        async response => {
          Log.info(response);

          const configurationsFolderConfigACL = new AccessControlConfig(
            configurationsFolderConfig.resource,
            [],
            configurationsFolderConfig.webID
          );

          await StorageFileManager.updateACL(configurationsFolderConfigACL);
        }
      );

      const sharedConfigurationsFolderConfig: ResourceConfig = new ResourceConfig(
        {
          path: `${url}/${folderTitle}`,
          title: 'sharedConfigurations',
          type: SolidResourceType.Folder
        },
        webId
      );

      await StorageFileManager.createResource(
        sharedConfigurationsFolderConfig
      ).then(async response => {
        Log.info(response);

        const sharedConfigurationsFolderConfigACL = new AccessControlConfig(
          sharedConfigurationsFolderConfig.resource,
          [],
          sharedConfigurationsFolderConfig.webID
        );

        await StorageFileManager.updateACL(sharedConfigurationsFolderConfigACL);
      });

      await StorageRdfManager.updateAppFolder(webId, folderUrl).then(() => {
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
    const oldFolder = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(originalFolder),
        title: Utils.getFilenameFromPathUrl(originalFolder),
        type: SolidResourceType.Folder
      },
      webId
    );

    const newFolder = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(destinationFolder),
        title: Utils.getFilenameFromPathUrl(destinationFolder),
        type: SolidResourceType.Folder
      },
      webId
    );

    const copyFolder = await StorageFileManager.copyResource(
      oldFolder,
      newFolder
    );

    const updateProfileLinkResult = await StorageRdfManager.updateAppFolder(
      webId,
      destinationFolder
    ).then(() => {
      return true;
    });

    return updateProfileLinkResult && copyFolder;
  }

  async moveFolderRecursively(
    webId: string,
    originalFolder: string,
    destinationFolder: string
  ): Promise<boolean> {
    const oldFolder = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(originalFolder),
        title: Utils.getFilenameFromPathUrl(originalFolder),
        type: SolidResourceType.Folder
      },
      webId
    );

    const newFolder = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(destinationFolder),
        title: Utils.getFilenameFromPathUrl(destinationFolder),
        type: SolidResourceType.Folder
      },
      webId
    );

    const copyFolder = await StorageFileManager.copyResource(
      oldFolder,
      newFolder
    );

    const newFolderAclDefault = new AccessControlConfig(
      newFolder.resource,
      [],
      newFolder.webID
    );

    await StorageFileManager.updateACL(newFolderAclDefault);

    const updateProfileLinkResult = await StorageRdfManager.updateAppFolder(
      webId,
      destinationFolder
    ).then(() => {
      return true;
    });

    const oldFolderConfigurations = new ResourceConfig(
      {
        path: originalFolder,
        title: 'configurations',
        type: SolidResourceType.Folder
      },
      webId
    );

    const oldFolderSharedConfigurations = new ResourceConfig(
      {
        path: originalFolder,
        title: 'sharedConfigurations',
        type: SolidResourceType.Folder
      },
      webId
    );

    const response = await StorageFileManager.deleteResource(
      oldFolderConfigurations
    );
    const response2 = await StorageFileManager.deleteResource(
      oldFolderSharedConfigurations
    );

    return copyFolder && updateProfileLinkResult;
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

    let sparqlQuery = '@prefix lpa: <https://w3id.org/def/lpapps#> .';
    const deleteStatements = [];
    const insertStatements = [];
    const whereStatements = [];

    let cnt = 0;

    for (const node of nodes) {
      deleteStatements.push(`?selectedOption${cnt} lpa:uri "${node.uri}" .
      ?selectedOption${cnt} lpa:selected ?selected${cnt} .
      ?selectedOption${cnt} lpa:visible ?visible${cnt} .
      ?selectedOption${cnt} lpa:enabled ?enabled${cnt} .`);

      insertStatements.push(`?selectedOption${cnt} lpa:uri "${node.uri}" .
      ?selectedOption${cnt} lpa:selected "${node.selected}" .
      ?selectedOption${cnt} lpa:visible "${node.visible}" .
      ?selectedOption${cnt} lpa:enabled "${node.enabled}" .`);

      whereStatements.push(`?selectedOption${cnt} lpa:uri "${node.uri}" .
      ?selectedOption${cnt} lpa:selected ?selected${cnt} .
      ?selectedOption${cnt} lpa:visible ?visible${cnt} .
      ?selectedOption${cnt} lpa:enabled ?enabled${cnt} . `);

      cnt += 1;
    }

    sparqlQuery += `

      DELETE {
        ${deleteStatements.join('\n')}
      }

      INSERT {
        ${insertStatements.join('\n')}
      }

      WHERE {
        ${whereStatements.join('\n')}
      }

    `;

    Log.info(sparqlQuery);

    await StorageSparqlClient.patchFileWithQuery(metadataUrl, sparqlQuery);

    try {
      await this.load($rdf.sym(metadataUrl).doc());
    } catch (err) {
      Log.error('Could not load a metadata document.', 'StorageBackend');
      return false;
    }

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
      const visualizerResourceConfig: ResourceConfig = new ResourceConfig(
        {
          path: appConfigurationFilePath,
          title: `${appConfigurationFileTitle}.ttl`,
          type: SolidResourceType.File,
          body: applicationConfigurationTurtle,
          isPublic: true
        },
        webId
      );

      await StorageFileManager.createResource(visualizerResourceConfig).then(
        async response => {
          Log.info(response);

          this.load($rdf.sym(appConfigurationFullPath).doc());

          const visualizerResourceConfigACL = new AccessControlConfig(
            visualizerResourceConfig.resource,
            [],
            visualizerResourceConfig.webID
          );

          await StorageFileManager.updateACL(visualizerResourceConfigACL);
        }
      );

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

      const visualizerResource = new ResourceConfig(
        {
          path: folderPath,
          title: metadataFileTitle,
          type: SolidResourceType.File
        },
        ''
      );

      const visualizerACLResource = new ResourceConfig(
        {
          path: folderPath,
          title: metadataFileTitle,
          type: SolidResourceType.File
        },
        ''
      );

      const resourceResponse = await StorageFileManager.deleteResource(
        visualizerResource
      );
      const aclResourceResponse = await StorageFileManager.deleteResource(
        visualizerACLResource
      );

      if (
        resourceResponse.status === 200 &&
        aclResourceResponse.status === 200
      ) {
        Log.info('Deleted the visualizer');
      }
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

  sendFileToInbox(recipientWebId, data, type) {
    const inboxUrl = `${Utils.getBaseUrlConcat(recipientWebId)}/inbox`;
    return StorageAuthenticationManager.fetch(inboxUrl, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': type
      }
    });
  }

  rejectInvitation(invitation) {
    const inviteResource = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(invitation.invitationUrl),
        title: Utils.getFilenameFromPathUrl(invitation.invitationUrl),
        type: SolidResourceType.File
      },
      ''
    );
    StorageFileManager.deleteResource(inviteResource).then(response => {
      if (response.status === 200) {
        Log.info(`Removed ${invitation.invitationUrl}.`);
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
    const deferred = Q.defer();
    const newResources = [];
    const rdfjsSource = await rdfjsSourceFromUrl(
      folderUrl,
      StorageAuthenticationManager.fetch
    );
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
    const deferred = Q.defer();
    const newResources = [];
    const rdfjsSource = await rdfjsSourceFromUrl(
      inboxUrl,
      StorageAuthenticationManager.fetch
    );
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
    const response = await StorageAuthenticationManager.fetch(invitationUrl);
    if (!response.ok) throw response;
    const invitation = await response.json();

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
    const sharedAppConfiguration = JSON.parse(
      await StorageFileManager.getResource(configurationUrl)
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
    let collaboratorWebIds = currentAccessControl.getCollaborators();
    collaboratorWebIds = collaboratorWebIds.filter(element => {
      return element !== webId;
    });
    const isPublic = currentAccessControl.isPublic();
    if (!collaboratorWebIds.includes(collaboratorWebId)) {
      collaboratorWebIds.push(collaboratorWebId);
    }

    const assembledIds = collaboratorWebIds.map(element => {
      return { agents: [element], modes: ['Read', 'Write'] };
    });

    const resourceConfigACL = new AccessControlConfig(
      { title: fileMetadataTitle, path: fileMetadataFolder, isPublic },
      assembledIds,
      webId
    );

    await StorageFileManager.updateACL(resourceConfigACL);

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
            const inviteResource = new ResourceConfig(
              {
                path: destinationPath,
                title: uniqueFileName,
                type: SolidResourceType.File,
                contentType: 'application/ld+json',
                body: doc
              },
              webId
            );
            const inviteACLResource = new AccessControlConfig(
              {
                path: destinationPath,
                title: uniqueFileName,
                type: SolidResourceType.File
              },
              [
                {
                  agents: [invitation.recipientWebId],
                  modes: ['Read', 'Write']
                }
              ],
              webId
            );
            await StorageFileManager.createResource(inviteResource);
            await StorageFileManager.updateACL(inviteACLResource);

            resolve(true);
          }
        });
    });
  }

  async removeInvitation(invitationUrl) {
    const inviteResource = new ResourceConfig(
      {
        path: Utils.getFolderUrlFromPathUrl(invitationUrl),
        title: Utils.getFilenameFromPathUrl(invitationUrl),
        type: SolidResourceType.File
      },
      ''
    );
    return StorageFileManager.deleteResource(inviteResource);
  }

  async fetchAccessControlFile(aclUrl) {
    const fetchResponse = await StorageFileManager.getResource(aclUrl, {
      headers: { Accept: 'application/ld+json' }
    });

    const response = JSON.parse(fetchResponse);

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

    const aclConfiguration = new AccessControlConfig(
      {
        path: fileMetadataFolder,
        title: fileMetadataTitle,
        type: SolidResourceType.File,
        isPublic
      },
      contacts.map(contact => {
        return { agents: [contact.webId], modes: ['Read', 'Write'] };
      }),
      webId
    );

    return StorageFileManager.updateACL(aclConfiguration);
  }
}

export default new SolidBackend();
