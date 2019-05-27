// @flow
import React, { PureComponent } from 'react';
import HomeComponent from './HomeComponent';
import { connect } from 'react-redux';
import { discoverActions } from '../DiscoverPage/duck';
import { etlActions } from '@ducks/etlDuck';
import { applicationActions } from '@ducks/applicationDuck';
import { globalActions } from '@ducks/globalDuck';
import { StorageToolbox } from '@storage';
import { toast } from 'react-toastify';
import {
  Log,
  SocketContext,
  ETLService,
  ETL_STATUS_TYPE,
  ETL_STATUS_MAP,
  withAuthorization,
  VisualizersService,
  UserService,
  GoogleAnalyticsWrapper
} from '@utils';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import AppConfiguration from '@storage/models/AppConfiguration';
import { userActions } from '@ducks/userDuck';

type Props = {
  history: { push: any },
  onInputExampleClicked: (sample: {}) => void,
  // eslint-disable-next-line react/no-unused-prop-types
  userProfile: Object,
  socket: Object,
  webId: Object,
  handleSetResultPipelineIri: Function,
  handleSetSelectedVisualizer: Function,
  handleSetSelectedApplicationData: Function,
  handleSetSelectedApplicationMetadata: Function,
  handleSetSelectedApplicationTitle: Function,
  handleSetUserProfileAsync: Function,
  webId: string,
  applicationsFolder: String,
  location: Object,
  tabIndex: number,
  handleSetHomepageTabIndex: Function
};
type State = {
  applicationsMetadata: Array<AppConfiguration>,
  loadingAppIsActive: boolean
};

class HomeContainer extends PureComponent<Props, State> {
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
    const {
      setupDiscoveryListeners,
      setupEtlExecutionsListeners,
      loadApplicationsMetadata
    } = this;

    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);

    setupDiscoveryListeners();
    setupEtlExecutionsListeners();
    loadApplicationsMetadata();
    this.isMounted = true;
  }

  async componentWillUpdate() {
    if (
      this.isMounted &&
      this.didLoadInitialMetadata &&
      this.props.userProfile.webId &&
      !this.didUpdateMetadata
    ) {
      await this.loadApplicationsMetadata();
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

  loadApplicationsMetadata = async () => {
    const { userProfile } = this.props;
    const webId = userProfile.webId;
    const applicationsFolder = userProfile.applicationsFolder;
    if (webId) {
      const metadata = await StorageToolbox.getAppConfigurationsMetadata(
        webId,
        applicationsFolder
      );

      if (this.isMounted) {
        this.setState({ applicationsMetadata: metadata });

        if (!this.didLoadInitialMetadata) {
          this.didLoadInitialMetadata = true;
        }

        Log.info(metadata, 'HomeContainer');
      }
    }
  };

  setupDiscoveryListeners = () => {
    const { userProfile, socket } = this.props;
    // eslint-disable-next-line array-callback-return
    userProfile.discoverySessions.map(discoveryRecord => {
      if (!discoveryRecord.finished) {
        socket.emit('join', discoveryRecord.id);
        Log.info(`Sending join to discovery room ${discoveryRecord.id}`);
      }
      return discoveryRecord;
    });
  };

  setupEtlExecutionsListeners = () => {
    const { userProfile, socket } = this.props;
    // eslint-disable-next-line array-callback-return
    userProfile.pipelineExecutions.map(pipelineRecord => {
      const rawStatus = pipelineRecord.status;

      let status;

      if (rawStatus && rawStatus.statusIri) {
        status = ETL_STATUS_MAP[rawStatus.statusIri]
          ? ETL_STATUS_MAP[rawStatus.statusIri]
          : ETL_STATUS_MAP[rawStatus['@id']];
      } else {
        status = ETL_STATUS_TYPE.Unknown;
      }

      if (
        status !== ETL_STATUS_TYPE.Finished &&
        status !== ETL_STATUS_TYPE.Cancelled &&
        status !== ETL_STATUS_TYPE.Unknown &&
        status !== ETL_STATUS_TYPE.Failed
      ) {
        socket.emit('join', pipelineRecord.executionIri);
        Log.info(
          `Sending join to pipeline execution room ${
            pipelineRecord.executionIri
          }`
        );
      }
      return pipelineRecord;
    });
  };

  handleChange = (event, tabIndex) => {
    this.props.handleSetHomepageTabIndex(tabIndex);
  };

  handleSampleClick = sample => {
    return () => {
      const { onInputExampleClicked, history } = this.props;
      onInputExampleClicked(sample);
      history.push('/discover');
    };
  };

  // TODO: Refactor
  handleSelectDiscoveryClick = discoveryId => {
    const { history } = this.props;
    Log.info(`About to push with id ${discoveryId}`);
    history.push({
      pathname: '/discover',
      state: { discoveryId }
    });
  };

  onHandleSelectPipelineExecutionClick = pipelineExecution => {
    const {
      history,
      handleSetResultPipelineIri,
      handleSetSelectedVisualizer
    } = this.props;
    Log.info(`About to push with id ${pipelineExecution}`);
    const pipelineIri = pipelineExecution.etlPipelineIri;
    const visualizerType = pipelineExecution.selectedVisualiser;

    ETLService.getPipeline({
      pipelineIri
    })
      .then(response => {
        return response.data;
      })
      .then(json => {
        const resultGraphIri = json.resultGraphIri;
        const selectedVisualiser = {
          visualizer: { visualizerCode: visualizerType }
        };

        handleSetResultPipelineIri(resultGraphIri);
        handleSetSelectedVisualizer(selectedVisualiser);

        history.push({
          pathname: '/create-app'
        });
      })
      .catch(error => {
        // handle error
        Log.error(error, 'HomeContainer');
      });
  };

  handleAppClicked = async applicationMetadata => {
    const {
      handleSetSelectedVisualizer,
      handleSetResultPipelineIri,
      handleSetSelectedApplicationTitle,
      handleSetSelectedApplicationData,
      handleSetSelectedApplicationMetadata,
      history
    } = this.props;

    await this.setApplicationLoaderStatus(true);

    const appConfigurationResponse = await axios.get(
      applicationMetadata.object
    );

    if (appConfigurationResponse.status !== 200) {
      toast.error('Error, unable to load!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      await this.setApplicationLoaderStatus(false);
    }
    const applicationData = appConfigurationResponse.data.applicationData;

    const resultGraphIri = applicationData.selectedResultGraphIri;

    let graphExists = true;

    await VisualizersService.getGraphExists(resultGraphIri).catch(() => {
      graphExists = false;
    });

    if (graphExists) {
      const selectedVisualiser = {
        visualizer: { visualizerCode: applicationData.visualizerCode }
      };

      handleSetResultPipelineIri(resultGraphIri);
      handleSetSelectedApplicationTitle(applicationMetadata.title);
      handleSetSelectedApplicationData(applicationData);
      handleSetSelectedApplicationMetadata(applicationMetadata);
      handleSetSelectedVisualizer(selectedVisualiser);

      await this.setApplicationLoaderStatus(false);

      history.push({
        pathname: '/create-app'
      });
    } else {
      toast.success(
        'Application data was removed or deleted from the platform,' +
          'blank metadata will be removed from storage...',
        {
          position: toast.POSITION.TOP_RIGHT
        }
      );
      this.handleDeleteApp(applicationMetadata);
    }
  };

  handleDeleteApp = async applicationMetadata => {
    const { setApplicationLoaderStatus } = this;

    await setApplicationLoaderStatus(true);

    const result = await StorageToolbox.removeAppFromStorage(
      this.props.applicationsFolder,
      applicationMetadata
    );
    if (result) {
      this.handleApplicationDeleted(applicationMetadata);
    }

    await setApplicationLoaderStatus(false);
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

  handleShareAppClicked = () => {
    toast.success('Copied link to clipboard!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  };

  handlePipelineExecutionRowDeleteClicked = async pipeline => {
    this.setApplicationLoaderStatus(true);

    const { handleSetUserProfileAsync, webId, socket } = this.props;

    const response = await UserService.deletePipelineExecution(
      webId,
      pipeline.executionIri,
      socket.id
    );
    if (response.status === 200) {
      await this.setApplicationLoaderStatus(false);
      await handleSetUserProfileAsync(response.data);
    } else {
      await this.setApplicationLoaderStatus(false);
      toast.error(
        'Error! Unable to delete pipeline execution session. Try again later...',
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000
        }
      );
    }
  };

  render() {
    const {
      handleChange,
      handleSampleClick,
      handleSelectDiscoveryClick,
      onHandleSelectPipelineExecutionClick,
      handleAppClicked,
      handleShareAppClicked,
      setApplicationLoaderStatus,
      handlePipelineExecutionRowDeleteClicked
    } = this;
    const { userProfile, tabIndex } = this.props;
    const { loadingAppIsActive } = this.state;

    return (
      <LoadingOverlay active={loadingAppIsActive} spinner>
        <HomeComponent
          onHandleTabChange={handleChange}
          onHandleSampleClick={handleSampleClick}
          onHandleSelectDiscoveryClick={handleSelectDiscoveryClick}
          onHandleSelectPipelineExecutionClick={
            onHandleSelectPipelineExecutionClick
          }
          applicationsList={this.state.applicationsMetadata}
          pipelinesList={userProfile.pipelineExecutions}
          discoveriesList={userProfile.discoverySessions}
          tabIndex={tabIndex}
          onHandleAppClicked={handleAppClicked}
          onHandleShareAppClicked={handleShareAppClicked}
          onSetApplicationLoaderStatus={setApplicationLoaderStatus}
          onHandlePipelineExecutionRowDeleteClicked={
            handlePipelineExecutionRowDeleteClicked
          }
        />
      </LoadingOverlay>
    );
  }
}

const HomeContainerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <HomeContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    userProfile: state.user,
    applicationsFolder: state.user.applicationsFolder,
    webId: state.user.webId,
    tabIndex: state.globals.homepageTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = sample =>
    dispatch(discoverActions.setSelectedInputExample(sample));

  const handleSetResultPipelineIri = resultGraphIri =>
    dispatch(
      etlActions.addSelectedResultGraphIriAction({
        data: resultGraphIri
      })
    );

  const handleSetSelectedVisualizer = visualizerData =>
    dispatch(
      globalActions.addSelectedVisualizerAction({
        data: visualizerData
      })
    );

  const handleSetSelectedApplicationTitle = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  const handleSetSelectedApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  const handleSetSelectedApplicationMetadata = applicationMetadata =>
    dispatch(applicationActions.setApplicationMetadata(applicationMetadata));

  const handleSetUserProfileAsync = userProfile =>
    dispatch(userActions.setUserProfileAsync(userProfile));

  const handleSetHomepageTabIndex = index =>
    dispatch(globalActions.setSelectedHomepageTabIndex(index));

  return {
    onInputExampleClicked,
    handleSetResultPipelineIri,
    handleSetSelectedVisualizer,
    handleSetSelectedApplicationTitle,
    handleSetSelectedApplicationData,
    handleSetSelectedApplicationMetadata,
    handleSetUserProfileAsync,
    handleSetHomepageTabIndex
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomeContainerWithSocket)
);
