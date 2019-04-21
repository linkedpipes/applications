// @flow
import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
// eslint-disable-next-line import/order
import { Log } from '@utils';
import StorageBackend from '../../StorageBackend';
import { connect } from 'react-redux';
import AppConfiguration from '@storage/models/AppConfiguration';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

type Props = {
  webId: string,
  applicationsFolder: string
};

type State = {
  applicationsMetadata: Array<AppConfiguration>,
  loadingAppIsActive: boolean
};

class StorageAppsBrowserContainer extends PureComponent<Props, State> {
  state = {
    applicationsMetadata: [],
    loadingAppIsActive: false
  };

  constructor(props) {
    super(props);
    this.setApplicationLoaderStatus = this.setApplicationLoaderStatus.bind(
      this
    );
  }

  componentDidMount() {
    this.loadStoredApplications();
  }

  componentWillUnmount() {
    this.setApplicationLoaderStatus(false);
  }

  setApplicationLoaderStatus: boolean => void;

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingAppIsActive: isLoading });
  }

  loadStoredApplications = async () => {
    const { webId, applicationsFolder } = this.props;
    if (webId) {
      const metadata = await StorageBackend.getAppConfigurationsMetadata(
        webId,
        applicationsFolder
      );

      this.setState({ applicationsMetadata: metadata });

      Log.info(metadata, 'StorageAppsBrowserContainer');
    }
  };

  handleApplicationDeleted = applicationConfigurationMetadata => {
    const newApplicationsMetadata = this.state.applicationsMetadata;

    const filteredMetadata = newApplicationsMetadata.filter(value => {
      return value.url !== applicationConfigurationMetadata.url;
    });

    toast.success(
      `Removed application:\n${applicationConfigurationMetadata.title}`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      }
    );

    this.setState({ applicationsMetadata: filteredMetadata });
  };

  render() {
    const { handleApplicationDeleted, setApplicationLoaderStatus } = this;
    const { loadingAppIsActive } = this.state;
    return (
      <LoadingOverlay active={loadingAppIsActive} spinner>
        <StorageAppsBrowserComponent
          applicationsMetadata={this.state.applicationsMetadata}
          setApplicationLoaderStatus={setApplicationLoaderStatus}
          onHandleApplicationDeleted={handleApplicationDeleted}
        />
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = state => {
  return {
    webId: state.user.webId,
    applicationsFolder: state.user.applicationsFolder
  };
};

export default connect(mapStateToProps)(StorageAppsBrowserContainer);
