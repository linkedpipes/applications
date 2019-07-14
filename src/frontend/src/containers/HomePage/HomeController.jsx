// @flow
import React, { PureComponent } from 'react';
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
  DiscoveriesCollection,
  PipelinesCollection,
  QuickStart
} from './children';
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
  discoveriesList: Array<Object>,
  pipelineExecutionsList: Array<Object>,
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
  dashboardTabIndex: number,
  handleSetHomepageTabIndex: Function,
  handleSetSparqlIri: Function,
  handleSetNamedGraph: Function,
  handleSetDataSampleIri: Function,
  selectedNavigationItem: string,
  handleSetSelectedNavigationItem: Function
};
type State = {
  applicationsMetadata: Array<ApplicationMetadata>,
  loadingAppIsActive: boolean
};

class HomeController extends PureComponent<Props, State> {
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

    const {
      selectedNavigationItem,
      handleSetSelectedNavigationItem
    } = this.props;

    if (selectedNavigationItem !== 'dashboard') {
      handleSetSelectedNavigationItem('dashboard');
    }

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
    const { discoveriesList, socket } = this.props;
    // eslint-disable-next-line array-callback-return
    discoveriesList.map(discoveryRecord => {
      if (!discoveryRecord.finished) {
        socket.emit('join', discoveryRecord.id);
        Log.info(`Sending join to discovery room ${discoveryRecord.id}`);
      }
      return discoveryRecord;
    });
  };

  setupEtlExecutionsListeners = () => {
    const { pipelineExecutionsList, socket } = this.props;
    // eslint-disable-next-line array-callback-return
    pipelineExecutionsList.map(pipelineRecord => {
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
      history.push('/create-application');
    };
  };

  // TODO: Refactor
  handleSelectDiscoveryClick = async discovery => {
    const {
      history,
      handleSetSparqlIri,
      handleSetNamedGraph,
      handleSetDataSampleIri
    } = this.props;
    const discoveryId = discovery.discoveryId;
    Log.info(`About to push with id ${discoveryId}`);
    await handleSetSparqlIri(discovery.sparqlEndpointIri);
    await handleSetNamedGraph(discovery.namedGraphs.join(',\n'));
    await handleSetDataSampleIri(discovery.dataSampleIri);
    await history.push({
      pathname: '/create-application',
      state: { discoveryId }
    });
  };

  handleSelectPipelineExecutionClick = pipelineExecution => {
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
          pathname: '/config-application'
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
        pathname: '/config-application'
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
      `Removed application:\n${applicationConfigurationMetadata.configuration.title}`,
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

  getContent = tabIndex => {
    const {
      handleSampleClick,
      handleSelectDiscoveryClick,
      handleSelectPipelineExecutionClick,
      setApplicationLoaderStatus,
      handlePipelineExecutionRowDeleteClicked
    } = this;

    const { discoveriesList, pipelineExecutionsList } = this.props;

    switch (tabIndex) {
      case 0:
        return <QuickStart onHandleSampleClick={handleSampleClick} />;
      case 1:
        return (
          <DiscoveriesCollection
            discoveriesList={discoveriesList}
            onHandleSelectDiscoveryClick={handleSelectDiscoveryClick}
            onSetApplicationLoaderStatus={setApplicationLoaderStatus}
          />
        );
      case 2:
        return (
          <PipelinesCollection
            pipelineExecutionsList={pipelineExecutionsList}
            onHandlePipelineExecutionRowDeleteClicked={
              handlePipelineExecutionRowDeleteClicked
            }
            onHandleSelectPipelineExecutionClick={
              handleSelectPipelineExecutionClick
            }
          />
        );
      default:
        return <QuickStart onHandleSampleClick={handleSampleClick} />;
    }
  };

  render() {
    const { dashboardTabIndex } = this.props;
    const { loadingAppIsActive } = this.state;

    return (
      <LoadingOverlay active={loadingAppIsActive} spinner>
        {this.getContent(dashboardTabIndex)}
      </LoadingOverlay>
    );
  }
}

const HomeControllerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <HomeController {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    discoveriesList: state.user.discoverySessions,
    pipelineExecutionsList: state.user.pipelineExecutions,
    userProfile: state.user,
    applicationsFolder: state.user.applicationsFolder,
    webId: state.user.webId,
    dashboardTabIndex: state.globals.dashboardTabIndex,
    selectedNavigationItem: state.globals.selectedNavigationItem
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

  const handleSetSparqlIri = sparqlIri =>
    dispatch(discoverActions.setSparqlEndpointIri(sparqlIri));

  const handleSetNamedGraph = namedGraph =>
    dispatch(discoverActions.setNamedGraph(namedGraph));

  const handleSetDataSampleIri = dataSampleIri =>
    dispatch(discoverActions.setDataSampleIri(dataSampleIri));

  const handleSetSelectedNavigationItem = item => {
    dispatch(globalActions.setSelectedNavigationItem(item));
  };

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
    handleSetFiltersState,
    handleSetSparqlIri,
    handleSetNamedGraph,
    handleSetDataSampleIri,
    handleSetSelectedNavigationItem
  };
};

export const HomePage = withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomeControllerWithSocket)
);
