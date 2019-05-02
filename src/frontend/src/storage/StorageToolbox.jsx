/* eslint-disable */
import stringHash from 'string-hash';
import { Log, GlobalUtils } from '@utils';
import SolidBackend from './StorageBackend';

const os = require('os');

const appIriToPublishUrl = (applicationIri, applicationEndpoint) => {
  const portSpecifier =
    process.env.BASE_SERVER_PORT === ''
      ? ''
      : `:${process.env.BASE_SERVER_PORT}`;
  const hostName = os.hostname().toLowerCase();
  const http = hostName === 'localhost' ? 'http://' : 'https://';
  const publishedUrl = `${http}${hostName}${portSpecifier}/${applicationEndpoint}?applicationIri=${applicationIri}`;

  return publishedUrl;
};

const saveAppToSolid = async (
  appData,
  appTitle,
  webId,
  appFolder,
  isPublic
) => {
  if (!webId) {
    Log.error('No webID available', 'StorageToolbox');
    return;
  }

  const file = JSON.stringify({
    applicationData: appData
  });

  const appEndpoint = appData.applicationEndpoint;

  const randomColor = GlobalUtils.randDarkColor();

  return await SolidBackend.uploadAppConfiguration(
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

const removeAppFromStorage = async (appFolder, appConfiguration) => {
  return await SolidBackend.removeAppConfiguration(appFolder, appConfiguration);
};

export default {
  saveAppToSolid,
  removeAppFromStorage,
  appIriToPublishUrl
};
