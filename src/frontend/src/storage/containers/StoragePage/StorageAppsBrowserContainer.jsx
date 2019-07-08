// @flow
import React, { PureComponent } from 'react';
import StorageAppsBrowserComponent from './StorageAppsBrowserComponent';
// eslint-disable-next-line import/order
import { Log } from '@utils';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import StorageToolbox from '../../StorageToolbox';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';

type Props = {
  webId: string,
  applicationsFolder: string
};

type State = {
  applicationsMetadata: Array<ApplicationMetadata>,
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
      const metadata = await StorageToolbox.getAppConfigurationsMetadata(
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
      return (
        value.solidFileUrl !== applicationConfigurationMetadata.solidFileUrl
      );
    });

    toast.success(
      `Removed application:\n${applicationConfigurationMetadata.configuration.title}`,
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
