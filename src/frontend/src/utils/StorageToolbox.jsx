/* eslint-disable consistent-return */
/* eslint-disable import/order */
import stringHash from 'string-hash';
import { Log, getLocation } from '@utils';

const os = require('os');

const FileClient = require('solid-file-client');

const shareApp = (appIri, webId) => {
  Log.info(appIri, 'StorageToolbox');

  if (!webId) {
    Log.error('No webID available', 'StorageToolbox');
    return;
  }

  const title = getLocation(appIri)
    .pathname.split('/public/lpapps/')[1]
    .split('.json')[0];

  const url = `${getLocation(webId).origin}/inbox/lpapps/${title}`;

  return new Promise((resolve, reject) => {
    FileClient.updateFile(url, appIri, 'text/plain').then(
      success => {
        Log.info(`Updated file!`);
        resolve();
      },
      err => {
        Log.info(err, 'StorageToolbox');
        FileClient.createFile(url, 'text/plain').then(
          success => {
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

const saveAppToSolid = (appData, appTitle, webId, path) => {
  Log.info(appData, 'StorageToolbox');

  if (!webId) {
    Log.error('No webID available', 'StorageToolbox');
    return;
  }

  const url = `${getLocation(webId).origin}/${path}`;

  const formattedTitle = appTitle.trim().toLowerCase();
  const hash = stringHash(JSON.stringify(formattedTitle, null, 2)).toString();
  const applicationIri = `${url}/lpapp${hash}.json`;
  const applicationEndpoint = appData.applicationEndpoint;

  const file = JSON.stringify({
    applicationData: appData,
    applicationTitle: appTitle
  });

  return new Promise((resolve, reject) => {
    FileClient.updateFile(applicationIri, file).then(
      () => {
        Log.info(`Updated file!`);
        resolve({ applicationIri, applicationEndpoint });
      },
      err => {
        Log.info(err, 'StorageToolbox');
        FileClient.createFile(applicationIri).then(
          () => {
            Log.info(`Created file!`);
            resolve({ applicationIri, applicationEndpoint });
          },
          errCreate => {
            reject(errCreate);
            Log.info(errCreate, 'StorageToolbox');
          }
        );
      }
    );
  });
};

const removeAppFromStorage = fileUrl => {
  return new Promise((resolve, reject) => {
    FileClient.deleteFile(fileUrl).then(
      () => {
        Log.info(`Removed file!`);
        resolve();
      },
      err => {
        reject(err);
      }
    );
  });
};

const loadAppFromSolid = appIri => {
  FileClient.readFile(appIri).then(
    body => {
      Log.info(`File content is : ${body}.`, 'StorageToolbox');
      return body;
    },
    err => Log.error(err, 'StorageToolbox')
  );
};

const createOrUpdateFolder = (webId, path) => {
  const folderPath = `${getLocation(webId).origin}/${path}`;

  FileClient.readFolder(folderPath).then(
    folder => {
      Log.info(`Read ${folder.name}, it has ${folder.files.length} files.`);
    },
    err => {
      FileClient.createFolder(folderPath).then(
        body => {
          Log.info(`File content is : ${body}.`, 'StorageToolbox');
          return body;
        },
        errCreate => Log.error(errCreate, 'StorageToolbox')
      );
    }
  );
};

export default {
  saveAppToSolid,
  loadAppFromSolid,
  shareApp,
  createOrUpdateFolder,
  removeAppFromStorage,
  appIriToPublishUrl
};
