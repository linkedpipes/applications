// @flow
import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
import { withWebId } from '@inrupt/solid-react-components';
import axios from 'axios';
// eslint-disable-next-line import/order
import { Log, getLocation, StorageToolbox } from '@utils';

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
    this.loadStoredApplications();
  }

  loadStoredApplications = () => {
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
                  // creating copy of object
                  const tileData = Object.assign({}, self.state.tileData);
                  const publishedUrl = StorageToolbox.appIriToPublishUrl(
                    element.url,
                    data.applicationData.applicationEndpoint
                  );
                  tileData[element.label] = {
                    applicationIri: publishedUrl,
                    applicationConfigurationIri: element.url,
                    applicationConfigurationLabel: element.label,
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
  };

  handleApplicationDeleted = applicationConfigurationLabel => {
    const newTileData = Object.assign({}, this.state.tileData);
    if (applicationConfigurationLabel in newTileData) {
      delete newTileData[applicationConfigurationLabel];
      this.setState({ tileData: newTileData });
    }
  };

  render() {
    const { handleApplicationDeleted } = this;
    return (
      <StorageAppsBrowserComponent
        tileData={this.state.tileData}
        onHandleApplicationDeleted={handleApplicationDeleted}
      />
    );
  }
}

export default withWebId(StorageAppsBrowserContainer);
