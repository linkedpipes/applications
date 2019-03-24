// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscoveryService, extractUrlGroups, SocketContext, Log } from '@utils';
import { discoveryActions, discoverySelectors } from '@ducks/discoveryDuck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';
import { withWebId } from '@inrupt/solid-react-components';
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
  webId: string
};

type State = {
  ttlFile: any,
  discoveryIsLoading: boolean,
  discoveryLoadingLabel: string
};

class DiscoverSelectorContainer extends PureComponent<Props, State> {
  state = {
    ttlFile: undefined,
    discoveryIsLoading: false,
    discoveryLoadingLabel: ''
  };

  componentWillUnmount = () => {
    const { socket } = this.props;
    socket.removeListener('discoveryStatus');
  };

  postStartFromFile = async instance => {
    return DiscoveryService.postDiscoverFromTtl({
      ttlFile: instance.state.ttlFile,
      webId: instance.props.webId
    }).then(response => {
      return response;
    });
  };

  postStartFromSparqlEndpoint = async instance => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: instance.props.sparqlEndpointIri,
      dataSampleIri: instance.props.dataSampleIri,
      namedGraph: instance.props.namedGraph,
      webId: instance.props.webId
    }).then(response => {
      return response;
    });
  };

  handleDiscoveryInputCase = () => {
    // eslint-disable-next-line consistent-this
    const instance = this;

    if (this.props.dataSourcesUris) {
      return DiscoveryService.postDiscoverFromTtl({
        ttlFile: this.props.dataSourcesUris,
        webId: instance.props.webId
      }).then(response => {
        return response;
      });
    }
    return this.postStartFromSparqlEndpoint(instance);
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

    socket.emit('join', discoveryId);
    socket.on('discoveryStatus', data => {
      if (data === undefined) {
        socket.emit('leave', discoveryId);
        socket.removeListener('discoveryStatus');
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
          socket.emit('leave', discoveryId);
          socket.removeListener('discoveryStatus');
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
    const matches = extractUrlGroups(rawText);
    if (matches instanceof Array) {
      rawText = matches.join(',\n');
    }
  };

  handleSelectedFile = fileItems => {
    this.setState({
      ttlFile: fileItems.length === 1 ? fileItems[0].file : undefined
    });
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

  render() {
    const {
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph
    } = this.props;

    const { discoveryIsLoading, ttlFile, discoveryLoadingLabel } = this.state;

    return (
      <DiscoverSelectorComponent
        discoveryIsLoading={discoveryIsLoading}
        discoveryLoadingLabel={discoveryLoadingLabel}
        dataSourcesUris={dataSourcesUris}
        onHandleSelectedFile={this.handleSelectedFile}
        ttlFile={ttlFile}
        sparqlEndpointIri={sparqlEndpointIri}
        onHandleClearInputsClicked={this.handleClearInputsClicked}
        dataSampleIri={dataSampleIri}
        onHandleProcessStartDiscovery={this.handleProcessStartDiscovery}
        onHandleSetNamedGraph={this.handleSetNamedGraph}
        onHandleSetDataSampleIri={this.handleSetDataSampleIri}
        onHandleSetSparqlIri={this.handleSetSparqlIri}
        namedGraph={namedGraph}
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
    namedGraph: state.discover.namedGraph
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

  const resetFieldsAndExamples = () => {
    dispatch(discoverActions.resetSelectedInputExample());
  };

  return {
    handleSetDiscoveryId,
    handleSetPipelineGroups,
    handleSetDataSampleIriFieldValue,
    handleSetNamedGraphFieldValue,
    handleSetSparqlIriFieldValue,
    resetFieldsAndExamples
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebId(DiscoverSelectorContainerWithSocket));
