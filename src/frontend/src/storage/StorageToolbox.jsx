import StorageBackend from './StorageBackend';
import { Utils } from './utils';
import ApplicationConfiguration from './models/ApplicationConfiguration';
import { Person } from './models';
import ApplicationMetadata from './models/ApplicationMetadata';
import { Log } from '@utils';
// eslint-disable-next-line import/order
const os = require('os');

class StorageToolbox {
  appIriToPublishUrl = (applicationIri, applicationEndpoint) => {
    const portSpecifier =
      process.env.BASE_SERVER_PORT === ''
        ? ''
        : `:${process.env.BASE_SERVER_PORT}`;
    const hostName = os.hostname().toLowerCase();
    const http = hostName === 'localhost' ? 'http://' : 'https://';
    const publishedUrl = `${http}${hostName}${portSpecifier}/${applicationEndpoint}?applicationIri=${applicationIri}`;

    return publishedUrl;
  };

  async saveAppToSolid(
    applicationConfiguration,
    filtersConfiguration,
    webId,
    appFolder
  ): Promise<ApplicationMetadata> {
    if (!webId) {
      Log.error('No webID available', 'StorageToolbox');
      return;
    }

    const applicationConfigurationObject = ApplicationConfiguration.fromRawParameters(
      applicationConfiguration,
      filtersConfiguration,
      webId
    );

    // eslint-disable-next-line consistent-return
    return StorageBackend.uploadApplicationConfiguration(
      applicationConfigurationObject,
      appFolder,
      webId
    );
  }

  removeAppFromStorage = async (appFolder, appMetadata) => {
    return StorageBackend.removeApplicationConfiguration(
      appFolder,
      appMetadata
    );
  };

  getInboxMessages = async webId => {
    const inboxUrl = `${Utils.getBaseUrlConcat(webId)}/inbox`;
    return StorageBackend.checkInboxFolder(inboxUrl);
  };

  readInboxInvite = async (fileUrl, userWebId) => {
    return StorageBackend.parseInvite(fileUrl, userWebId);
  };

  processAcceptShareInvite = async acceptedInvitation => {
    await StorageBackend.processAcceptSharedInvite(acceptedInvitation);
  };

  readSharedConfiguration = async fileUrl => {
    return StorageBackend.parseSharedConfiguration(fileUrl);
  };

  sendCollaborationInvitation = async (
    applicationMetadata,
    webId,
    recipientWebId
  ) => {
    const invitation = await StorageBackend.generateInvitationFile(
      applicationMetadata.solidFileUrl,
      webId,
      recipientWebId
    );

    StorageBackend.sendFileToInbox(
      recipientWebId,
      invitation,
      'application/ld+json'
    );
  };

  sendAcceptCollaborationInvitation = async invitation => {
    await StorageBackend.createSharedMetadataFromInvite(invitation);

    const invitationResponse = await StorageBackend.generateResponseToInvitation(
      invitation,
      'yes'
    );

    const recipientWebId = invitation.senderWebId;

    StorageBackend.sendFileToInbox(
      recipientWebId,
      invitationResponse,
      'application/ld+json'
    );

    await StorageBackend.removeInvitation(invitation.invitationUrl).then(
      response => {
        if (response.status === 200) {
          const filePath = response.url;
          Log.info(`Removed ${filePath}.`);
        }
      }
    );
  };

  sendRejectCollaborationInvitation = async invitation => {
    StorageBackend.rejectInvitation(invitation);
  };

  getSharedApplicationsMetadata = async (webId: string, appFolder: string) => {
    const sharedConfigurationsUrl = `${appFolder}/sharedConfigurations`;
    const updates = await StorageBackend.checkSharedConfigurationsFolder(
      sharedConfigurationsUrl
    );
    const sharedApplicationsMetadata = [];
    const self = this;

    await Promise.all(
      updates.map(async fileUrl => {
        const sharedConfiguration = await self.readSharedConfiguration(fileUrl);
        Log.info(sharedConfiguration);

        sharedApplicationsMetadata.push(sharedConfiguration.appMetadata);
      })
    );

    Log.info(sharedApplicationsMetadata);

    return sharedApplicationsMetadata;
  };

  copyFolderRecursively = async (webId, originalFolder, destinationFolder) => {
    return StorageBackend.copyFoldersRecursively(
      webId,
      originalFolder,
      destinationFolder
    );
  };

  moveFolderRecursively = async (webId, originalFolder, destinationFolder) => {
    return StorageBackend.moveFolderRecursively(
      webId,
      originalFolder,
      destinationFolder
    );
  };

  getAppConfigurationsMetadata = async (
    webId: string,
    appFolder: string
  ): Promise<ApplicationConfiguration[]> => {
    return StorageBackend.getAppConfigurationsMetadata(webId, appFolder);
  };

  getAppMetadata = async (
    appMetadataUrl: string,
    callbackOnRefresh: Function,
    forceReload: Boolean = false
  ): Promise<ApplicationMetadata[]> => {
    return StorageBackend.getAppConfigurationMetadata(
      appMetadataUrl,
      callbackOnRefresh,
      forceReload
    );
  };

  getPerson = async (webId: string): Promise<Person> => {
    return StorageBackend.getPerson(webId);
  };

  getValidAppFolder = async (webId: string): Promise<string> => {
    return StorageBackend.getValidAppFolder(webId);
  };

  createAppFolders = async (
    webId: string,
    folderTitle: string
  ): Promise<boolean> => {
    return StorageBackend.createAppFolders(webId, folderTitle);
  };

  renameAppConfiguration = async (
    metadataUrl: string,
    newTitle: string
  ): Promise<boolean> => {
    return StorageBackend.renameAppConfiguration(metadataUrl, newTitle);
  };

  setFiltersStateEnabled = async (
    metadataUrl: string,
    isEnabled: boolean
  ): Promise<boolean> => {
    return StorageBackend.setFiltersStateEnabled(metadataUrl, isEnabled);
  };

  setFiltersStateVisible = async (
    metadataUrl: string,
    isVisible: boolean
  ): Promise<boolean> => {
    return StorageBackend.setFiltersStateVisible(metadataUrl, isVisible);
  };

  setSelectedFilterOptions = async (
    metadataUrl: string,
    nodes: Array<Object>
  ): Promise<boolean> => {
    return StorageBackend.setSelectedFilterOptions(metadataUrl, nodes);
  };

  getFriends = async (webId: string): Promise<Person[]> => {
    return StorageBackend.getFriends(webId);
  };

  fetchAclFromMetadata = async (metadata: ApplicationMetadata) => {
    const metadataAcl = `${metadata.solidFileUrl}.acl`;
    const accessControlObject = await StorageBackend.fetchAccessControlFile(
      metadataAcl
    );
    return accessControlObject;
  };

  async getPersons(webIds: string[]): Promise<Person[]> {
    return StorageBackend.getPersons(webIds);
  }

  updateAccessControl(
    webId: string,
    metadataUrl: string,
    isPublic: boolean,
    contacts: Array<Person>
  ) {
    return StorageBackend.updateAccessControlFile(
      webId,
      metadataUrl,
      isPublic,
      contacts
    );
  }
}

export default new StorageToolbox();
