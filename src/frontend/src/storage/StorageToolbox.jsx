/* eslint-disable */
import stringHash from 'string-hash';
import { Log, GlobalUtils } from '@utils';
import StorageBackend from './StorageBackend';
import { Utils } from './utils';
import AppConfiguration from './models/AppConfiguration';
import { AccessControl, Person } from './models';

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

  saveAppToSolid = async (appData, appTitle, webId, appFolder, isPublic) => {
    if (!webId) {
      Log.error('No webID available', 'StorageToolbox');
      return;
    }

    const file = JSON.stringify({
      applicationData: appData
    });

    const appEndpoint = appData.applicationEndpoint;

    const randomColor = GlobalUtils.randDarkColor();

    return await StorageBackend.uploadAppConfiguration(
      file,
      appTitle,
      appEndpoint,
      webId,
      appFolder,
      isPublic,
      randomColor,
      []
    );
  };

  removeAppFromStorage = async (appFolder, appConfiguration) => {
    return await StorageBackend.removeAppConfiguration(
      appFolder,
      appConfiguration
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
    applicationConfiguration,
    webId,
    recipientWebId
  ) => {
    let invitation = await StorageBackend.generateInvitationFile(
      applicationConfiguration.url,
      applicationConfiguration.url,
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
    const sharedApplicationsConfigurations = [];
    const self = this;

    await Promise.all(
      updates.map(async fileUrl => {
        const sharedConfiguration = await self.readSharedConfiguration(fileUrl);
        Log.info(sharedConfiguration);
        const appMetadataUrl = sharedConfiguration.url;
        const appConfiguration = await StorageBackend.getAppConfigurationMetadata(
          appMetadataUrl
        );
        sharedApplicationsConfigurations.push(appConfiguration);
      })
    );

    Log.info(sharedApplicationsConfigurations);

    return sharedApplicationsConfigurations;
  };

  copyFolderRecursively = async (webId, originalFolder, destinationFolder) => {
    return await StorageBackend.copyFoldersRecursively(
      webId,
      originalFolder,
      destinationFolder
    );
  };

  moveFolderRecursively = async (webId, originalFolder, destinationFolder) => {
    return await StorageBackend.moveFolderRecursively(
      webId,
      originalFolder,
      destinationFolder
    );
  };

  getAppConfigurationsMetadata = async (
    webId: string,
    appFolder: string
  ): Promise<ApplicationConfiguration[]> => {
    return await StorageBackend.getAppConfigurationsMetadata(webId, appFolder);
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

  getFriends = async (webId: string): Promise<Person[]> => {
    return StorageBackend.getFriends(webId);
  };

  fetchAclFromMetadata = async (metadata: AppConfiguration) => {
    const metadataAcl = `${metadata.url}.acl`;
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
