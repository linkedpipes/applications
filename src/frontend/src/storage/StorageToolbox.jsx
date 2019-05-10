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
    recepientWebId
  ) => {
    let invitation = StorageBackend.generateInvitationFile(
      applicationConfiguration.url,
      applicationConfiguration.url,
      webId,
      recepientWebId
    );

    StorageBackend.storeInvitationFile(
      applicationConfiguration.url,
      invitation.sparqlUpdate
    );

    StorageBackend.sendInviteToInbox(recepientWebId, invitation.notification);

    Log.info(invitation);
  };

  sendAcceptCollaborationInvitation = async notification => {
    const response = await StorageBackend.generateResponseToInvitation(
      userDataUrl,
      invitationUrl,
      userWebId,
      opponentWebId,
      'yes'
    );

    dataSync.executeSPARQLUpdateForUser(
      userDataUrl,
      `INSERT DATA {
  <${gameUrl}> a <${namespaces.chess}ChessGame>;
    <${namespaces.storage}storeIn> <${userDataUrl}>.
    ChessGame
    ${response.sparqlUpdate}
  }`
    );
    dataSync.executeSPARQLUpdateForUser(
      userWebId,
      `INSERT DATA { <${gameUrl}> ${SCHEMA('contributor')} <${userWebId}>; <${
        namespaces.storage
      }storeIn> <${userDataUrl}>.}`
    );
    dataSync.sendToOpponentsInbox(
      await this.getInboxUrl(opponentWebId),
      response.notification
    );
    dataSync.deleteFileForUser(fileUrl);
  };
}

export default new StorageToolbox();
