import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscoveryService, extractUrlGroups } from '@utils';
import { discoverySelectors } from '@ducks/discoveryDuck';
import { visualizersActions } from '@ducks/visualizersDuck';
import { globalActions } from '@ducks/globalDuck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';
import { withWebId } from '@inrupt/solid-react-components';
import { SocketContext } from '@utils';

class DiscoverSelectorContainer extends PureComponent {
  state = {
    ttlFile: undefined,
    discoveryIsLoading: false,
    textFieldValue: '',
    textFieldIsValid: false,
    discoveryStatusPolling: undefined,
    discoveryStatusPollingFinished: false,
    discoveryStatusPollingInterval: 2000,
    discoveryLoadingLabel: '',
    tabValue: 0,
    sparqlEndpointIri: '',
    dataSampleIri: '',
    namedGraph: ''
  };

  postStartFromFile = async () => {
    const self = this;
    return DiscoveryService.postDiscoverFromTtl({
      ttlFile: self.state.ttlFile,
      webId: this.props.webId
    }).then(response => {
      return response.json();
    });
  };

  // TODO: refactor later, move to separate class responsible for _services calls
  postStartFromInputLinks = async () => {
    const textContent =
      this.props.selectedInputExample !== undefined
        ? this.props.selectedInputExample
        : this.state.textFieldIsValid;

    const splitFieldValue = textContent.split(',\n');
    const datasourcesForTTL = splitFieldValue.map(source => {
      return { uri: source };
    });

    if (this.props.selectedInputExample !== undefined) {
      // Clear out selected sources that failed
      this.props.onInputExampleClicked(undefined);
    }

    return DiscoveryService.postDiscoverFromUriList({
      datasourceUris: datasourcesForTTL,
      webId: this.props.webId
    }).then(response => {
      return response.json();
    });
  };

  postStartFromSparqlEndpoint = async () => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: this.state.sparqlEndpointIri,
      dataSampleIri: this.state.dataSampleIri,
      namedGraph: this.state.namedGraph,
      webId: this.props.webId
    }).then(response => {
      return response.json();
    });
  };

  addDiscoveryId = response => {
    const self = this;
    const discoveryId = response.id;

    return new Promise(resolve => {
      self.props.dispatch(
        globalActions.addDiscoveryIdAction({
          id: discoveryId
        })
      );
      resolve();
    });
  };

  handleDiscoveryInputCase = () => {
    if (this.state.tabValue === 1) {
      return this.postStartFromSparqlEndpoint();
    }
    if (this.state.ttlFile) {
      return this.postStartFromFile();
    }
    return this.postStartFromInputLinks();
  };

  handleProcessStartDiscovery = () => {
    const self = this;

    self.setState({
      discoveryIsLoading: true,
      discoveryLoadingLabel:
        'Please, hold on Discovery is casting spells 🧙‍...'
    });

    self
      .handleDiscoveryInputCase()
      .then(discoveryResponse => {
        if (discoveryResponse !== undefined) {
          self.addDiscoveryId(discoveryResponse).then(() => {
            self.setState({ discoveryStatusPollingFinished: false });
            // self.checkDiscovery(discoveryResponse, undefined);
            self.startSocketListener();
          });
        }
      })
      .catch(() => {
        // Enable the fields
        self.setState({
          discoveryIsLoading: false,
          textFieldValue: '',
          textFieldIsValid: true
        });

        // Clear out selected sources that failed
        self.props.onInputExampleClicked(undefined);

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
    const { socket, discoveryId, onNextClicked } = this.props;
    const self = this;

    socket.emit('join', discoveryId);
    socket.on('discoveryStatus', data => {
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
        if (parsedData.isFinished) {
          self.loadPipelineGroups(discoveryId).then(() => {
            self.setState({
              discoveryIsLoading: false
            });

            onNextClicked();
          });
        }
      }
      socket.emit('leave', discoveryId);
    });
  };

  loadPipelineGroups = discoveryId => {
    this.setState({
      discoveryLoadingLabel: 'Extracting the magical pipelines 🧙‍...'
    });

    const self = this;

    return DiscoveryService.getPipelineGroups({ discoveryId })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        self.props.dispatch(
          visualizersActions.addVisualizer({
            visualizersArray: jsonResponse.pipelineGroups
          })
        );
        return jsonResponse;
      });
  };

  handleTabChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  };

  handleValidation = rawText => {
    const matches = extractUrlGroups(rawText);
    let valid = false;

    if (matches instanceof Array) {
      rawText = matches.join(',\n');
      valid = true;
    }

    this.setState({
      textFieldValue: rawText,
      textFieldIsValid: valid
    });

    if (this.props.selectedInputExample !== undefined) {
      this.props.selectedInputExample(undefined);
    }
  };

  handleSelectedFile = fileItems => {
    this.setState({
      ttlFile: fileItems.length === 1 ? fileItems[0].file : undefined
    });
  };

  handleValidateField = e => {
    const rawText = e.target.value;
    this.handleValidation(rawText);
  };

  handkeSetSparqlIri = e => {
    const rawText = e.target.value;
    this.setState({
      sparqlEndpointIri: rawText
    });
  };

  handleSetDataSampleIri = e => {
    const rawText = e.target.value;
    this.setState({
      dataSampleIri: rawText
    });
  };

  handleSetNamedGraph = e => {
    const rawText = e.target.value;
    this.setState({
      namedGraph: rawText
    });
  };

  render() {
    const { selectedInputExample } = this.props;
    const { tabValue } = this.state;
    const {
      discoveryIsLoading,
      textFieldValue,
      textFieldIsValid,
      ttlFile,
      sparqlEndpointIri,
      dataSampleIri,
      discoveryLoadingLabel
    } = this.state;

    return (
      <DiscoverSelectorComponent
        discoveryIsLoading={discoveryIsLoading}
        discoveryLoadingLabel={discoveryLoadingLabel}
        tabValue={tabValue}
        onHandleTabChange={this.handleTabChange}
        selectedInputExample={selectedInputExample}
        textFieldValue={textFieldValue}
        onHandleSelectedFile={this.handleSelectedFile}
        onValidateField={this.handleValidateField}
        ttlFile={ttlFile}
        textFieldIsValid={textFieldIsValid}
        sparqlEndpointIri={sparqlEndpointIri}
        dataSampleIri={dataSampleIri}
        onHandleProcessStartDiscovery={this.handleProcessStartDiscovery}
        onHandleSetNamedGraph={this.handleSetNamedGraph}
        onHandleSetDataSampleIri={this.handleSetDataSampleIri}
        onHandleSetSparqlIri={this.handleSetSparqlIri}
      />
    );
  }
}

DiscoverSelectorContainer.propTypes = {
  discoveryId: PropTypes.any,
  onInputExampleClicked: PropTypes.any,
  selectedInputExample: PropTypes.any,
  socket: PropTypes.any,
  webId: PropTypes.any
};

const DiscoverSelectorContainerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <DiscoverSelectorContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    datasources: discoverySelectors.getDatasourcesArray(state.datasources),
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(
  withWebId(DiscoverSelectorContainerWithSocket)
);
