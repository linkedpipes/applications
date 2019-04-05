// @flow
import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
import { withWebId } from '@inrupt/solid-react-components';
import axios from 'axios';
// eslint-disable-next-line import/order
import { Log, getLocation } from '@utils';

const FileClient = require('solid-file-client');

type Props = {
  webId: string
};

type State = {
  tileData: {}
};

class StorageAppsBrowserContainer extends PureComponent<Props, State> {
  state = {
    tileData: {}
  };

  componentDidMount() {
    const { webId } = this.props;
    if (webId) {
      const url = `${getLocation(webId).origin}/public/lpapps`;

      const self = this;
      FileClient.readFolder(url).then(
        folder => {
          Log.info(
            `Read ${folder.name}, it has ${folder.files.length} files.`,
            'StorageAppsBrowserContainer'
          );
          folder.files.forEach(element => {
            if (!(element.label in self.state.tileData)) {
              axios
                .get(element.url)
                .then(({ data }) => {
                  const tileData = Object.assign({}, self.state.tileData); // creating copy of object
                  tileData[element.label] = {
                    applicationIri: data.publishedUrl,
                    applicationTitle: data.applicationTitle,
                    applicationData: data.applicationData
                  };
                  self.setState({ tileData });
                })
                .catch(err => {
                  Log.error(err, 'StorageAppsBrowserContainer');
                });
            }
          });
          self.forceUpdate();
        },
        err => Log.error(err, 'StorageAppsBrowserContainer')
      );
    }
  }

  render() {
    const { tileData } = this.state;
    return <StorageAppsBrowserComponent tileData={tileData} />;
  }
}

export default withWebId(StorageAppsBrowserContainer);
