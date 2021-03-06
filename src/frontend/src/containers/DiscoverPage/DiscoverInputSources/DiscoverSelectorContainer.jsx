// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { discoveryActions, discoverySelectors } from '@ducks/discoveryDuck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';
import { discoverActions } from '../duck';
import { globalActions } from '@ducks/globalDuck';
import { etlActions } from '@ducks/etlDuck';
import {
  DiscoveryService,
  GlobalUtils,
  SocketContext,
  Log,
  GoogleAnalyticsWrapper
} from '@utils';

type Props = {
  dataSampleIri: string,
  dataSourcesUris: string,
  handleSetDiscoveryId: any,
  handleSetPipelineGroups: any,
  namedGraph: string,
  onNextClicked: any,
  socket: any,
  sparqlEndpointIri: string,
  handleSetSparqlIriFieldValue: Function,
  handleSetNamedGraphFieldValue: Function,
  handleSetDataSampleIriFieldValue: Function,
  resetFieldsAndExamples: Function,
  // eslint-disable-next-line react/no-unused-prop-types
  webId: string,
  rdfInputIri: string,
  handleSetRdfInputIriUrlFieldValue: Function,
  inputType: string,
  handleSetRdfFile: Function,
  handleSetRdfDataSampleFile: Function,
  rdfFile: Object,
  rdfDataSampleFile: Object,
  activeDiscoverTabIndex: Number,
  handleSetActiveDiscoverTabIndex: Function,
  handleAddSelectedVisualizer: Function,
  setPipelineExecutorStep: Function,
  setPipelineSelectorStep: Function,
  handleSetSelectedPipelineId: Function,
  rdfUrlDataSampleIri: string,
  handleSetRdfUrlDataSampleIriFieldValue: Function,
  handleSetDataSampleSessionId: Function,
  // eslint-disable-next-line react/no-unused-prop-types
  discoveryId: string,
  rdfUrlDataSampleIri: string
};

type State = {
  discoveryIsLoading: boolean,
  discoveryLoadingLabel: string
};

class DiscoverSelectorContainer extends PureComponent<Props, State> {
  isMounted = false;

  state = {
    discoveryIsLoading: false,
    discoveryLoadingLabel: ''
  };

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  postStartFromRdfInputFile = async () => {
    return DiscoveryService.postDiscoverFromInputFile({
      webId: this.props.webId,
      rdfFile: this.props.rdfFile,
      rdfDataSampleFile: this.props.rdfDataSampleFile
    }).then(response => {
      return response;
    });
  };

  postStartFromSparqlEndpoint = async () => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: this.props.sparqlEndpointIri,
      dataSampleIri: this.props.dataSampleIri,
      namedGraphs: this.props.namedGraph,
      webId: this.props.webId
    }).then(response => {
      return response;
    });
  };

  postStartFromRdfInputIri = async () => {
    const { rdfInputIri, webId, rdfUrlDataSampleIri } = this.props;
    return DiscoveryService.postDiscoverFromInputIri({
      rdfInputIri,
      webId,
      dataSampleIri: rdfUrlDataSampleIri
    }).then(response => {
      return response;
    });
  };

  handleDiscoveryInputCase = () => {
    const { inputType } = this.props;
    switch (inputType) {
      case 'RDF_INPUT_IRI':
        return this.postStartFromRdfInputIri();

      case 'RDF_INPUT_FILE':
        return this.postStartFromRdfInputFile();

      default:
        return this.postStartFromSparqlEndpoint();
    }
  };

  handleProcessStartDiscovery = () => {
    const self = this;
    const { handleSetDiscoveryId, handleSetDataSampleSessionId } = this.props;

    self.setState({
      discoveryIsLoading: true,
      discoveryLoadingLabel: 'Please, hold on processing the request...'
    });

    self
      .handleDiscoveryInputCase()
      .then(response => {
        if (response !== undefined) {
          const discoveryResponse = response.data;
          const discoveryId = discoveryResponse.discoveryId;
          if (discoveryId === null) {
            const sessionId = discoveryResponse.sessionId;
            handleSetDataSampleSessionId(sessionId);
          } else {
            handleSetDiscoveryId(discoveryId);
          }
          self.startSocketListener();
        }
      })
      .catch(error => {
        // Enable the fields
        Log.error(error, 'DiscoverSelectorContainer');
        self.setState({
          discoveryIsLoading: false
        });

        toast.error(
          'There was an error during the discovery. Please, try different sources.',
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      });
  };

  startSocketListener = () => {
    const { socket, onNextClicked } = this.props;
    const self = this;

    socket.on('discoveryStatus', data => {
      if (!this.isMounted) {
        return;
      }

      if (data === undefined) {
        self.setState({
          discoveryIsLoading: false
        });
        toast.error(
          'There was an error during the discovery. Please, try different sources.',
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      } else {
        const parsedData = JSON.parse(data);
        if (parsedData.discoveryId !== self.props.discoveryId) {
          return;
        }
        if (parsedData.status.isFinished) {
          GoogleAnalyticsWrapper.trackEvent({
            category: 'Discovery',
            action: 'Processed discovery : step 1'
          });

          self.loadPipelineGroups(self.props.discoveryId).then(response => {
            self.setState({
              discoveryIsLoading: false
            });

            if (response.length === 1) {
              self.selectVisualizer(response[0]);
            } else {
              onNextClicked();
            }
          });
        }

        socket.emit('leave', parsedData.discoveryId);
      }
    });
  };

  loadPipelineGroups = discoveryId => {
    this.setState({
      discoveryLoadingLabel: 'Extracting the magical pipelines 🧙‍...'
    });

    const { handleSetPipelineGroups } = this.props;

    return DiscoveryService.getPipelineGroups({ discoveryId })
      .then(response => {
        return response.data;
      })
      .then(jsonResponse => {
        handleSetPipelineGroups(jsonResponse.pipelineGroups);
        return jsonResponse.pipelineGroups;
      });
  };

  addVisualizer = visualizerData => {
    const { handleAddSelectedVisualizer } = this.props;
    return new Promise(resolve => {
      handleAddSelectedVisualizer(visualizerData);
      resolve();
    });
  };

  selectVisualizer = visualizerData => {
    GoogleAnalyticsWrapper.trackEvent({
      category: 'Discovery',
      action: 'Automatically selected visualizer : step 2'
    });

    const { setPipelineSelectorStep } = this.props;

    const dataSourceGroups = visualizerData.dataSourceGroups;

    const self = this;

    self.addVisualizer(visualizerData).then(() => {
      if (dataSourceGroups.length === 1) {
        self.handleSelectPipeline(dataSourceGroups[0]);
      } else {
        setPipelineSelectorStep();
      }
    });
  };

  handleSelectPipeline = datasourceAndPipelines => {
    const { handleSetSelectedPipelineId, setPipelineExecutorStep } = this.props;
    const pipelines = datasourceAndPipelines.pipelines;
    pipelines.sort((a, b) => a.minimalIteration < b.minimalIteration);
    const pipelineWithMinIterations = pipelines[0];
    const pipelineId = pipelineWithMinIterations.id;

    handleSetSelectedPipelineId(pipelineId);
    setPipelineExecutorStep();
  };

  handleValidation = rawText => {
    const matches = GlobalUtils.extractUrlGroups(rawText);
    if (matches instanceof Array) {
      rawText = matches.join(',\n');
    }
  };

  // Handle when the text in the SPARQL
  // endpoint textfields changes
  handleSetSparqlIri = e => {
    const rawText = e.target.value;
    this.props.handleSetSparqlIriFieldValue(rawText);
  };

  handleSetDataSampleIri = e => {
    const rawText = e.target.value;
    this.props.handleSetDataSampleIriFieldValue(rawText);
  };

  handleSetRdfUrlDataSampleIri = e => {
    const rawText = e.target.value;
    this.props.handleSetRdfUrlDataSampleIriFieldValue(rawText);
  };

  handleSetNamedGraph = e => {
    const rawText = e.target.value;
    Log.info('Named graph field changed', 'DiscoverSelectorContainer');
    Log.info(rawText, 'DiscoverSelectorContainer');
    this.props.handleSetNamedGraphFieldValue(rawText);
  };

  handleClearInputsClicked = () => {
    this.props.resetFieldsAndExamples();
  };

  handleRdfInputIriTextFieldChange = e => {
    const rawText = e.target.value;
    Log.info('Rdf field changed', 'DiscoverSelectorContainer');
    Log.info(rawText, 'DiscoverSelectorContainer');
    this.props.handleSetRdfInputIriUrlFieldValue(rawText);
  };

  handleSetRdfFile = file => {
    if (!file) {
      Log.info('Rdf file deselected', 'DiscoverSelectorContainer');
    } else {
      Log.info('Rdf file selected', 'DiscoverSelectorContainer');
      this.props.handleSetRdfFile(file);
    }
  };

  handleSetRdfDataSampleFile = file => {
    if (!file) {
      Log.info('Rdf data sample file deselected', 'DiscoverSelectorContainer');
    } else {
      Log.info('Rdf data sample file selected', 'DiscoverSelectorContainer');
      this.props.handleSetRdfDataSampleFile(file);
    }
  };

  handleTabIndexChange = (event, newValue) => {
    const { activeDiscoverTabIndex } = this.props;
    if (activeDiscoverTabIndex !== newValue) {
      this.props.handleSetActiveDiscoverTabIndex(newValue);
    }
  };

  render() {
    const {
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph,
      rdfInputIri,
      inputType,
      rdfFile,
      activeDiscoverTabIndex,
      rdfUrlDataSampleIri
    } = this.props;

    const { discoveryIsLoading, discoveryLoadingLabel } = this.state;
    const inputFieldsAreNotFilled =
      (inputType === 'SPARQL_ENDPOINT' &&
        (sparqlEndpointIri === '' ||
          namedGraph === '' ||
          dataSampleIri === '')) ||
      (inputType === 'RDF_INPUT_IRI' && rdfInputIri === '') ||
      (inputType === 'RDF_INPUT_FILE' && rdfFile === undefined);

    return (
      <DiscoverSelectorComponent
        discoveryIsLoading={discoveryIsLoading}
        inputFieldsAreNotFilled={inputFieldsAreNotFilled}
        discoveryLoadingLabel={discoveryLoadingLabel}
        dataSourcesUris={dataSourcesUris}
        sparqlEndpointIri={sparqlEndpointIri}
        namedGraph={namedGraph}
        dataSampleIri={dataSampleIri}
        rdfUrlDataSampleIri={rdfUrlDataSampleIri}
        onHandleClearInputsClicked={this.handleClearInputsClicked}
        onHandleProcessStartDiscovery={this.handleProcessStartDiscovery}
        onHandleSetNamedGraph={this.handleSetNamedGraph}
        onHandleSetDataSampleIri={this.handleSetDataSampleIri}
        onHandleSetSparqlIri={this.handleSetSparqlIri}
        onHandleRdfInputIriTextFieldChange={
          this.handleRdfInputIriTextFieldChange
        }
        onHandleSetRdfFile={this.handleSetRdfFile}
        onHandleSetRdfDataSampleFile={this.handleSetRdfDataSampleFile}
        rdfInputIri={rdfInputIri}
        tabIndex={activeDiscoverTabIndex}
        onHandleTabIndexChange={this.handleTabIndexChange}
        onHandleSetRdfUrlDataSampleIri={this.handleSetRdfUrlDataSampleIri}
      />
    );
  }
}

const DiscoverSelectorContainerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <DiscoverSelectorContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    datasources: discoverySelectors.getDatasourcesArray(
      state.discovery.datasources
    ),
    discoveryId: state.discovery.discoveryId,
    dataSampleSessionId: state.discovery.dataSampleSessionId,
    dataSourcesUris: state.discover.dataSourcesUris,
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    rdfUrlDataSampleIri: state.discover.rdfUrlDataSampleIri,
    namedGraph: state.discover.namedGraph,
    webId: state.user.webId,
    rdfInputIri: state.discover.rdfInputIri,
    rdfFile: state.discover.rdfFile,
    rdfDataSampleFile: state.discover.rdfDataSampleFile,
    inputType: state.discover.inputType,
    activeDiscoverTabIndex: state.discover.activeDiscoverTabIndex,
    visualizers: state.discovery.pipelineGroups
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetDiscoveryId = discoveryId =>
    dispatch(
      discoveryActions.addDiscoveryIdAction({
        id: discoveryId
      })
    );

  const handleSetDataSampleSessionId = dataSampleSessionId =>
    dispatch(
      discoveryActions.addDataSampleSessionIdAction(dataSampleSessionId)
    );

  const setPipelineSelectorStep = () =>
    dispatch(discoverActions.setActiveStep(2));

  const setPipelineExecutorStep = () =>
    dispatch(discoverActions.setActiveStep(3));

  const handleSetSelectedPipelineId = pipelineId =>
    dispatch(etlActions.setPipelineIdAction(pipelineId));

  const handleSetPipelineGroups = pipelineGroups =>
    dispatch(discoveryActions.setPipelineGroupsAction(pipelineGroups));

  const handleSetSparqlIriFieldValue = sparqlIri =>
    dispatch(discoverActions.setSparqlEndpointIri(sparqlIri));

  const handleSetNamedGraphFieldValue = namedGraph =>
    dispatch(discoverActions.setNamedGraph(namedGraph));

  const handleSetDataSampleIriFieldValue = dataSampleIri =>
    dispatch(discoverActions.setDataSampleIri(dataSampleIri));

  const handleSetRdfUrlDataSampleIriFieldValue = rdfUrlDataSampleIri =>
    dispatch(discoverActions.setRdfUrlDataSampleIri(rdfUrlDataSampleIri));

  const handleSetRdfInputIriUrlFieldValue = rdfInputIri =>
    dispatch(discoverActions.setRdfInputIri(rdfInputIri));

  const resetFieldsAndExamples = () => {
    dispatch(discoverActions.resetSelectedInputExample());
  };

  const handleSetRdfFile = file => {
    dispatch(discoverActions.setRdfFile(file));
  };

  const handleSetRdfDataSampleFile = file => {
    dispatch(discoverActions.setRdfDataSampleFile(file));
  };

  const handleSetActiveDiscoverTabIndex = tabIndex => {
    dispatch(discoverActions.setActiveDiscoverTabIndexAsync(tabIndex));
  };

  const handleAddSelectedVisualizer = visualizerData =>
    dispatch(
      globalActions.addSelectedVisualizerAction({
        data: visualizerData
      })
    );

  return {
    handleSetDiscoveryId,
    handleSetDataSampleSessionId,
    handleSetRdfUrlDataSampleIriFieldValue,
    handleSetPipelineGroups,
    handleSetDataSampleIriFieldValue,
    handleSetNamedGraphFieldValue,
    handleSetSparqlIriFieldValue,
    handleSetRdfInputIriUrlFieldValue,
    resetFieldsAndExamples,
    handleSetRdfFile,
    handleSetRdfDataSampleFile,
    handleSetActiveDiscoverTabIndex,
    handleAddSelectedVisualizer,
    handleSetSelectedPipelineId,
    setPipelineExecutorStep,
    setPipelineSelectorStep
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverSelectorContainerWithSocket);
