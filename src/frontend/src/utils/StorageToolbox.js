/* eslint-disable import/order */
import stringHash from 'string-hash';
import data from '@solid/query-ldflex';
import { Log } from '@utils';

const FileClient = require('solid-file-client');
const fs = require('fs');

const saveAppToSolid = configuration => {
  Log.info(configuration, 'StorageToolbox');
  const url = 'https://aorumbayev1.inrupt.net/public/lpapps';
  const hash = stringHash(
    JSON.stringify(configuration.type, null, 2) +
      JSON.stringify(configuration.markers, null, 2)
  ).toString();
  const fileUrl = `${url}/lpapp${hash}`;

  const file = JSON.stringify(configuration, null, 2);

  FileClient.readFolder(url).then(
    folder => {
      Log.info(`Read ${folder.name}, it has ${folder.files.length} files.`);
    },
    err => Log.error(err, 'StorageToolbox')
  );

  FileClient.createFile(fileUrl).then(
    success => {
      Log.info(`Created file.`);
      FileClient.updateFile(fileUrl, file, 'text/plain').then(
        success => {
          Log.info(`Updated file!`);
        },
        err => Log.info(err, 'StorageToolbox')
      );
    },
    err => Log.info(err, 'StorageToolbox')
  );
};

export default saveAppToSolid;
