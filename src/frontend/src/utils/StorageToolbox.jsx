/* eslint-disable consistent-return */
/* eslint-disable import/order */
import stringHash from 'string-hash';
import { Log, getLocation } from '@utils';

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

const saveAppToSolid = (appData, appTitle, webId) => {
  Log.info(appData, 'StorageToolbox');

  if (!webId) {
    Log.error('No webID available', 'StorageToolbox');
    return;
  }

  const url = `${getLocation(webId).origin}/public/lpapps`;

  const hash = stringHash(JSON.stringify(appTitle, null, 2)).toString();
  const fileUrl = `${url}/lpapp${hash}.json`;

  const file = JSON.stringify({
    applicationData: appData,
    applicationTitle: appTitle
  });

  return new Promise((resolve, reject) => {
    FileClient.updateFile(fileUrl, file).then(
      () => {
        Log.info(`Updated file!`);
        resolve(fileUrl);
      },
      err => {
        Log.info(err, 'StorageToolbox');
        FileClient.createFile(fileUrl).then(
          () => {
            Log.info(`Created file!`);
            resolve(fileUrl);
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

const loadAppFromSolid = appIri => {
  FileClient.readFile(appIri).then(
    body => {
      Log.info(`File content is : ${body}.`, 'StorageToolbox');
      return body;
    },
    err => Log.error(err, 'StorageToolbox')
  );
};

export default { saveAppToSolid, loadAppFromSolid, shareApp };
