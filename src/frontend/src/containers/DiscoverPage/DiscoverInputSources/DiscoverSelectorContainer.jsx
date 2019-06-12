// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  DiscoveryService,
  GlobalUtils,
  SocketContext,
  Log,
  GoogleAnalyticsWrapper
} from '@utils';
import { discoveryActions, discoverySelectors } from '@ducks/discoveryDuck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';
import { discoverActions } from '../duck';

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
  handleSetRdfFile: Function
};

type State = {
  discoveryIsLoading: boolean,
  discoveryLoadingLabel: string,
  tabIndex: Object
};

class DiscoverSelectorContainer extends PureComponent<Props, State> {
  isMounted = false;

  state = {
    discoveryIsLoading: false,
    discoveryLoadingLabel: '',
    tabIndex: 0
  };

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  postStartFromFile = async instance => {
    return DiscoveryService.postDiscoverFromTtl({
      webId: instance.props.webId
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
    const { rdfInputIri, webId } = this.props;
    return DiscoveryService.postDiscoverFromInputIri({
      rdfInputIri,
      webId
    }).then(response => {
      return response;
    });
  };

  handleDiscoveryInputCase = () => {
    const { inputType } = this.props;
    switch (inputType) {
      case 'RDF_INPUT_IRI':
        return this.postStartFromRdfInputIri();

      default:
        return this.postStartFromSparqlEndpoint();
    }
  };

  handleProcessStartDiscovery = () => {
    const self = this;
    const { handleSetDiscoveryId } = this.props;

    self.setState({
      discoveryIsLoading: true,
      discoveryLoadingLabel: 'Please, hold on processing the request...'
    });

    self
      .handleDiscoveryInputCase()
      .then(response => {
        if (response !== undefined) {
          const discoveryResponse = response.data;
          const discoveryId = discoveryResponse.id;
          handleSetDiscoveryId(discoveryId);
          self.startSocketListener(discoveryId);
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

  startSocketListener = discoveryId => {
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
        if (parsedData.discoveryId !== discoveryId) {
          return;
        }
        if (parsedData.status.isFinished) {
          GoogleAnalyticsWrapper.trackEvent({
            category: 'Discovery',
            action: 'Processed discovery : step 1'
          });

          self.loadPipelineGroups(discoveryId).then(() => {
            self.setState({
              discoveryIsLoading: false
            });
            onNextClicked();
          });
        }
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
        return jsonResponse;
      });
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

  handleSetRdfFile = e => {
    const rdfFile = e.target.value;
    Log.info('Rdf file selected', 'DiscoverSelectorContainer');
    this.props.handleSetRdfFile(rdfFile);
  };

  handleTabIndexChange = (event, newValue) => {
    this.setState({ tabIndex: newValue });
  };

  render() {
    const {
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph,
      rdfInputIri,
      inputType
    } = this.props;

    const { discoveryIsLoading, discoveryLoadingLabel, tabIndex } = this.state;
    const inputFieldsAreNotFilled =
      (inputType === 'SPARQL_ENDPOINT' &&
        (sparqlEndpointIri === '' ||
          namedGraph === '' ||
          dataSampleIri === '')) ||
      (inputType === 'RDF_INPUT_IRI' && rdfInputIri === '');

    return (
      <DiscoverSelectorComponent
        discoveryIsLoading={discoveryIsLoading}
        inputFieldsAreNotFilled={inputFieldsAreNotFilled}
        discoveryLoadingLabel={discoveryLoadingLabel}
        dataSourcesUris={dataSourcesUris}
        sparqlEndpointIri={sparqlEndpointIri}
        namedGraph={namedGraph}
        dataSampleIri={dataSampleIri}
        onHandleClearInputsClicked={this.handleClearInputsClicked}
        onHandleProcessStartDiscovery={this.handleProcessStartDiscovery}
        onHandleSetNamedGraph={this.handleSetNamedGraph}
        onHandleSetDataSampleIri={this.handleSetDataSampleIri}
        onHandleSetSparqlIri={this.handleSetSparqlIri}
        onHandleRdfInputIriTextFieldChange={
          this.handleRdfInputIriTextFieldChange
        }
        onHandleSetRdfFile={this.handleSetRdfFile}
        rdfInputIri={rdfInputIri}
        tabIndex={tabIndex}
        onHandleTabIndexChange={this.handleTabIndexChange}
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
    dataSourcesUris: state.discover.dataSourcesUris,
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    namedGraph: state.discover.namedGraph,
    webId: state.user.webId,
    rdfInputIri: state.discover.rdfInputIri,
    inputType: state.discover.inputType
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetDiscoveryId = discoveryId =>
    dispatch(
      discoveryActions.addDiscoveryIdAction({
        id: discoveryId
      })
    );

  const handleSetPipelineGroups = pipelineGroups =>
    dispatch(discoveryActions.setPipelineGroupsAction(pipelineGroups));

  const handleSetSparqlIriFieldValue = sparqlIri =>
    dispatch(discoverActions.setSparqlEndpointIri(sparqlIri));

  const handleSetNamedGraphFieldValue = namedGraph =>
    dispatch(discoverActions.setNamedGraph(namedGraph));

  const handleSetDataSampleIriFieldValue = dataSampleIri =>
    dispatch(discoverActions.setDataSampleIri(dataSampleIri));

  const handleSetRdfInputIriUrlFieldValue = rdfInputIri =>
    dispatch(discoverActions.setRdfInputIri(rdfInputIri));

  const resetFieldsAndExamples = () => {
    dispatch(discoverActions.resetSelectedInputExample());
  };

  const handleSetRdfFile = file => {
    dispatch(discoverActions.handleSetRdfFile(file));
  };

  return {
    handleSetDiscoveryId,
    handleSetPipelineGroups,
    handleSetDataSampleIriFieldValue,
    handleSetNamedGraphFieldValue,
    handleSetSparqlIriFieldValue,
    handleSetRdfInputIriUrlFieldValue,
    resetFieldsAndExamples,
    handleSetRdfFile
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverSelectorContainerWithSocket);
