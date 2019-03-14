import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
import { withWebId } from '@inrupt/solid-react-components';
// eslint-disable-next-line import/order
import { Log } from '@utils';

const FileClient = require('solid-file-client');

const tileData = {};

class StorageAppsBrowserContainer extends React.PureComponent {
  componentDidMount() {
    if (this.props.webId) {
      const url = 'https://aorumbayev1.inrupt.net/public/lpapps';
      const self = this;
      FileClient.readFolder(url).then(
        folder => {
          Log.info(
            `Read ${folder.name}, it has ${folder.files.length} files.`,
            'StorageAppsBrowserContainer'
          );
          folder.files.forEach(element => {
            if (!(element.label in tileData)) {
              tileData[element.label] = {
                img:
                  'https://www.iosicongallery.com/icons/google-maps-2014-11-12/512.png',
                author: 'Altynbek'
              };
            }
          });
          self.forceUpdate();
        },
        err => Log.error(err, 'StorageAppsBrowserContainer')
      );
    }
  }

  render() {
    const { classes } = this.props;
    const self = this;
    return <StorageAppsBrowserComponent tileData={tileData} />;
  }
}

export default withWebId(StorageAppsBrowserContainer);
