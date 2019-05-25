// @flow
import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
// eslint-disable-next-line import/order
import { Log, ReactGAWrapper } from '@utils';
import StorageBackend from '../../StorageBackend';
import { connect } from 'react-redux';
import AppConfiguration from '@storage/models/AppConfiguration';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

type Props = {
  webId: string,
  applicationsFolder: string,
  location: Object
};

type State = {
  applicationsMetadata: Array<AppConfiguration>,
  loadingAppIsActive: boolean
};

class StorageAppsBrowserContainer extends PureComponent<Props, State> {
  isMounted = false;

  didLoadInitialMetadata = false;

  didUpdateMetadata = false;

  state = {
    applicationsMetadata: [],
    loadingAppIsActive: false
  };

  constructor(props) {
    super(props);
    (this: any).setApplicationLoaderStatus = this.setApplicationLoaderStatus.bind(
      this
    );
  }

  componentDidMount() {
    const page = this.props.location.pathname;
    ReactGAWrapper.trackPage(page);

    this.loadStoredApplications();
    this.isMounted = true;
  }

  async componentWillUpdate() {
    if (
      this.isMounted &&
      this.didLoadInitialMetadata &&
      this.props.webId &&
      !this.didUpdateMetadata
    ) {
      this.loadStoredApplications();
      this.didUpdateMetadata = true;
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
    this.didUpdateMetadata = false;
    this.didLoadInitialMetadata = false;
  }

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

      if (this.isMounted) {
        this.setState({ applicationsMetadata: metadata });
        Log.info(metadata, 'StorageAppsBrowserContainer');
        if (!this.didLoadInitialMetadata) {
          this.didLoadInitialMetadata = true;
        }
      }
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
        autoClose: 4000
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
