// @flow
import React, { PureComponent } from 'react';
import { HomeComponent } from './HomeComponent';
import { connect } from 'react-redux';
import { discoverActions } from '../DiscoverPage/duck';
import { etlActions } from '@ducks/etlDuck';
import { applicationActions } from '@ducks/applicationDuck';
import { globalActions } from '@ducks/globalDuck';
import { filtersActions } from '@ducks/filtersDuck';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import { userActions } from '@ducks/userDuck';
import { ApplicationMetadata } from '@storage/models';
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
import { StorageToolbox } from '@storage';

type Props = {
  history: { push: any },
  onInputExampleClicked: (sample: {}) => void,
  // eslint-disable-next-line react/no-unused-prop-types
  userProfile: Object,
  socket: Object,
  webId: Object,
  handleSetResultPipelineIri: Function,
  handleSetPipelineExecutionIri: Function,
  handleSetSelectedVisualizer: Function,
  handleSetSelectedApplicationData: Function,
  handleSetSelectedApplicationMetadata: Function,
  handleSetSelectedApplicationTitle: Function,
  handleSetUserProfileAsync: Function,
  handleSetFiltersState: Function,
  webId: string,
  applicationsFolder: String,
  location: Object,
  tabIndex: number,
  handleSetHomepageTabIndex: Function
};
type State = {
  applicationsMetadata: Array<ApplicationMetadata>,
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
          `Sending join to pipeline execution room ${pipelineRecord.executionIri}`
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
      handleSetPipelineExecutionIri,
      handleSetSelectedVisualizer
    } = this.props;
    Log.info(`About to push with id ${pipelineExecution}`);
    const pipelineIri = pipelineExecution.etlPipelineIri;
    const visualizerType = pipelineExecution.selectedVisualiser;
    const executionIri = pipelineExecution.executionIri;

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
        handleSetPipelineExecutionIri(executionIri);
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
      handleSetFiltersState,
      history
    } = this.props;

    await this.setApplicationLoaderStatus(true);

    const applicationConfiguration = applicationMetadata.configuration;

    const resultGraphIri = applicationConfiguration.graphIri;

    let graphExists = true;

    await VisualizersService.getGraphExists(resultGraphIri).catch(() => {
      graphExists = false;
    });

    if (graphExists) {
      const selectedVisualiser = {
        visualizer: { visualizerCode: applicationConfiguration.visualizerType }
      };

      await handleSetResultPipelineIri(resultGraphIri);
      await handleSetSelectedApplicationTitle(applicationConfiguration.title);
      await handleSetSelectedApplicationData(applicationConfiguration);
      await handleSetSelectedApplicationMetadata(applicationMetadata);
      await handleSetSelectedVisualizer(selectedVisualiser);
      await handleSetFiltersState(applicationConfiguration.filterConfiguration);

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
      this.handleDeleteApp();
    }
  };

  handleDeleteApp = async (applicationMetadata: ApplicationMetadata) => {
    const { setApplicationLoaderStatus } = this;

    await setApplicationLoaderStatus(true);

    const result = await StorageToolbox.removeAppFromStorage(
      this.props.applicationsFolder,
      applicationMetadata
    );
    if (result) {
      await UserService.deleteApplication(
        this.props.webId,
        applicationMetadata.solidFileUrl
      );
      this.handleApplicationDeleted(applicationMetadata);
    }

    await setApplicationLoaderStatus(false);
  };

  handleApplicationDeleted = (
    applicationConfigurationMetadata: ApplicationMetadata
  ) => {
    const newApplicationsMetadata = this.state.applicationsMetadata;

    const filteredMetadata = newApplicationsMetadata.filter(value => {
      return (
        value.solidFileUrl !== applicationConfigurationMetadata.solidFileUrl
      );
    });

    toast.success(
      `Removed application:\n${applicationConfigurationMetadata.solidFileTitle}`,
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
      handleDeleteApp,
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
          onHandleDeleteAppClicked={handleDeleteApp}
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
    dispatch(etlActions.addSelectedResultGraphIriAction(resultGraphIri));

  const handleSetPipelineExecutionIri = executionIri => {
    dispatch(etlActions.setSelectedPipelineExecution(executionIri));
  };

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

  const handleSetFiltersState = filters =>
    dispatch(filtersActions.setFiltersState(filters));

  return {
    onInputExampleClicked,
    handleSetResultPipelineIri,
    handleSetPipelineExecutionIri,
    handleSetSelectedVisualizer,
    handleSetSelectedApplicationTitle,
    handleSetSelectedApplicationData,
    handleSetSelectedApplicationMetadata,
    handleSetUserProfileAsync,
    handleSetHomepageTabIndex,
    handleSetFiltersState
  };
};

export const HomePage = withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomeContainerWithSocket)
);
