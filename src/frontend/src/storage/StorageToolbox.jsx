/* eslint-disable */
import stringHash from 'string-hash';
import { Log, GlobalUtils } from '@utils';
import SolidBackend from './StorageBackend';

const os = require('os');

const shareApp = (appIri, webId) => {
  Log.info(appIri, 'StorageToolbox');

  if (!webId) {
    Log.error('No webID available', 'StorageToolbox');
    return;
  }

  const title = GlobalUtils.getLocation(appIri)
    .pathname.split('/public/lpapps/')[1]
    .split('.json')[0];

  const url = `${GlobalUtils.getLocation(webId).origin}/inbox/lpapps/${title}`;

  return new Promise((resolve, reject) => {
    import(
      /* webpackChunkName: "solid-file-client" */ 'solid-file-client'
    ).then(FileClient => {
      FileClient.updateFile(url, appIri, 'text/plain').then(
        () => {
          Log.info(`Updated file!`);
          resolve();
        },
        err => {
          Log.info(err, 'StorageToolbox');
          FileClient.createFile(url, 'text/plain').then(
            () => {
              Log.info(`Created file!`);
              resolve();
            },
            errCreate => {
              reject(errCreate);
              Log.info(errCreate, 'StorageToolbox');
            }
          );
        }
      );
    });
  });
};

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

const removeAppFromStorage = async appConfiguration => {
  return await SolidBackend.removeAppConfiguration(appConfiguration);
};

const loadAppFromSolid = appIri => {
  import(/* webpackChunkName: "solid-file-client" */  'solid-file-client').then(FileClient => {
    FileClient.readFile(appIri).then(
      body => {
        Log.info(`File content is : ${body}.`, 'StorageToolbox');
        return body;
      },
      err => Log.error(err, 'StorageToolbox')
    );
  });
};

const createOrUpdateFolder = (webId, path) => {
  const folderPath = `${GlobalUtils.getLocation(webId).origin}/${path}`;

  import(/* webpackChunkName: "solid-file-client" */  'solid-file-client').then(FileClient => {
    FileClient.readFolder(folderPath).then(
      folder => {
        Log.info(`Read ${folder.name}, it has ${folder.files.length} files.`);
      },
      () => {
        FileClient.createFolder(folderPath).then(
          body => {
            Log.info(`File content is : ${body}.`, 'StorageToolbox');
            return body;
          },
          errCreate => Log.error(errCreate, 'StorageToolbox')
        );
      }
    );
  });
};

export default {
  saveAppToSolid,
  loadAppFromSolid,
  shareApp,
  createOrUpdateFolder,
  removeAppFromStorage,
  appIriToPublishUrl
};
