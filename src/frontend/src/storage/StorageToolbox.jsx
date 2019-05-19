/* eslint-disable */
import stringHash from 'string-hash';
import { Log, GlobalUtils } from '@utils';
import StorageBackend from './StorageBackend';
import { Utils } from './utils';

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

  getInboxMessages = async inboxUrl => {
    return StorageBackend.checkInboxFolder(inboxUrl);
  };

  readShareInviteNotification = async (fileUrl, userWebId) => {
    return StorageBackend.parseShareInviteNotification(fileUrl, userWebId);
  };

  sendCollaborationInvitation = async (
    applicationConfiguration,
    webId,
    recipientWebId
  ) => {
    let invitation = StorageBackend.generateInvitationFile(
      applicationConfiguration.url,
      applicationConfiguration.url,
      webId,
      recipientWebId
    );

    StorageBackend.storeInvitationFile(
      applicationConfiguration.url,
      invitation.sparqlUpdate
    );

    StorageBackend.sendInviteToInbox(recipientWebId, invitation.notification);

    Log.info(invitation);
  };

  acceptCollaborationInvitation = async notification => {
    return StorageBackend.acceptCollaborationInvitation(notification);
  };

  sendAcceptCollaborationInvitation = async notification => {
    const response = StorageBackend.generateResponseToInvitation(
      notification,
      'yes'
    );
    const metadataUrl = notification.appMetadataUrl;
    const userWebId = notification.recipientWebId;
    const invitationUrl = notification.invitationUrl;
    const recipientWebId = notification.senderWebId;

    StorageBackend.storeInvitationResponseFile(
      metadataUrl,
      response.sparqlUpdate
    );

    StorageBackend.sendInviteToInbox(recipientWebId, response.notification);
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
        const notification = await self.readShareInviteNotification(
          fileUrl,
          webId
        );
        Log.info(notification);
        const appMetadataUrl = notification.appMetadataUrl;
        const appConfiguration = await StorageBackend.getAppConfigurationMetadata(
          appMetadataUrl
        );
        sharedApplicationsConfigurations.push(appConfiguration);
      })
    );

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
}

export default new StorageToolbox();
