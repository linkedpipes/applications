// @flow
import React, { PureComponent } from 'react';
import StorageSharedAppsBrowserComponent from './StorageSharedAppsBrowserComponent';
// eslint-disable-next-line import/order
import { Log } from '@utils';
import StorageToolbox from '../../StorageToolbox';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import ApplicationConfiguration from '@storage/models/ApplicationConfiguration';

type Props = {
  webId: string,
  applicationsFolder: string
};

type State = {
  sharedApplicationsMetadata: Array<ApplicationConfiguration>,
  loadingAppIsActive: boolean
};

class StorageSharedAppsBrowserContainer extends PureComponent<Props, State> {
  isMounted = false;

  didUpdateMetadata = false;

  state = {
    sharedApplicationsMetadata: [],
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
    if (this.isMounted && this.props.webId && !this.didUpdateMetadata) {
      // this.loadStoredApplications();
      this.didUpdateMetadata = true;
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
    this.didUpdateMetadata = false;
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingAppIsActive: isLoading });
  }

  loadStoredApplications = async () => {
    const { webId, applicationsFolder } = this.props;
    if (webId) {
      const metadata = await StorageToolbox.getSharedApplicationsMetadata(
        webId,
        applicationsFolder
      );

      if (this.isMounted) {
        this.setState({ sharedApplicationsMetadata: metadata });
        Log.info(metadata, 'StorageAppsBrowserContainer');
      }
    }
  };

  handleApplicationDeleted = applicationConfigurationMetadata => {
    const newSharedApplicationsMetadata = this.state.sharedApplicationsMetadata;

    const filteredMetadata = newSharedApplicationsMetadata.filter(value => {
      return (
        value.solidFileUrl !== applicationConfigurationMetadata.solidFileUrl
      );
    });

    toast.success(
      `Removed application:\n${
        applicationConfigurationMetadata.solidFileTitle
      }`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      }
    );

    this.setState({ sharedApplicationsMetadata: filteredMetadata });
  };

  render() {
    const { handleApplicationDeleted, setApplicationLoaderStatus } = this;
    const { loadingAppIsActive } = this.state;
    return (
      <LoadingOverlay active={loadingAppIsActive} spinner>
        <StorageSharedAppsBrowserComponent
          sharedApplicationsMetadata={this.state.sharedApplicationsMetadata}
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

export default withRouter(
  connect(mapStateToProps)(StorageSharedAppsBrowserContainer)
);
