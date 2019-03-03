/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscoveryService, extractUrlGroups } from '@utils';
import { discoverySelectors } from '@ducks/discoveryDuck';
import { visualizersActions } from '@ducks/visualizersDuck';
import { globalActions } from '@ducks/globalDuck';
import { discoverActions } from '../duck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';

const mapDispatchToProps = dispatch => {
  const changeTab = index => dispatch(discoverActions.changeTabAction(index));
  return {
    changeTab
  };
};

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
    sparqlTextFieldValue: '',
    dataSampleTextFieldValue: '',
    namedTextFieldValue: '',
  };

  postStartFromFile = async () => {
    const self = this;
    return DiscoveryService.postDiscoverFromTtl({
      ttlFile: self.state.ttlFile
    }).then(response => {
      return response.json();
    });
  };

  // TODO: refactor later, move to separate class responsible for _services calls
  postStartFromInputLinks = async () => {
    const textContent =
      !this.props.dataSourcesUris
        ? this.props.dataSourcesUris
        : this.state.textFieldIsValid;

    const splitFieldValue = textContent.split(',\n');
    const datasourcesForTTL = splitFieldValue.map(source => {
      return { uri: source };
    });

    return DiscoveryService.postDiscoverFromUriList({
      datasourceUris: datasourcesForTTL
    }).then(response => {
      return response.json();
    });
  };

  postStartFromSparqlEndpoint = async () => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: this.state.sparqlEndpointIri,
      dataSampleIri: this.state.dataSampleIri,
      namedGraph: this.state.namedGraph
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
            self.checkDiscovery(discoveryResponse, undefined);
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

        toast.error(
          'There was an error during the discovery. Please, try different sources.',
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      });
  };

  checkDiscovery = response => {
    const self = this;
    const discoveryId = response.id;
    const {
      discoveryStatusPolling,
      discoveryStatusPollingFinished,
      discoveryStatusPollingInterval
    } = this.state;

    if (discoveryStatusPolling) {
      clearTimeout(discoveryStatusPolling);
    }

    if (discoveryStatusPollingFinished) {
      this.setState({ discoveryStatusPolling: undefined });

      self.loadPipelineGroups(discoveryId).then(() => {
        self.setState({
          discoveryIsLoading: false
        });

        self.props.onNextClicked();
      });

      return;
    }

    DiscoveryService.getDiscoveryStatus({ discoveryId })
      .then(statusResponse => {
        return statusResponse.json();
      })
      .then(jsonResponse => {
        self.setState({
          discoveryStatusPollingFinished: jsonResponse.isFinished
        });
      });

    const newDiscoveryStatusPolling = setTimeout(() => {
      this.checkDiscovery(response);
    }, discoveryStatusPollingInterval);

    this.setState({
      discoveryStatusPolling: newDiscoveryStatusPolling
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
    this.props.changeTab(newValue);
  };

  handleChangeIndex = index => {
    this.props.changeTab(index);
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

  handleSetSparqlIri = e => {
    const rawText = e.target.value;
    this.setState({
      sparqlTextFieldValue: rawText
    });
  };

  handleSetDataSampleIri = e => {
    const rawText = e.target.value;
    this.setState({
      dataSampleTextFieldValue: rawText
    });
  };

  handleSetNamedGraph = e => {
    const rawText = e.target.value;
    this.setState({
      namedTextFieldValue: rawText
    });
  };

  render() {
    const {
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph,
      tabValue
    } = this.props;

    const {
      discoveryIsLoading,
      textFieldValue,
      textFieldIsValid,
      ttlFile,
      discoveryLoadingLabel,
      sparqlTextFieldValue,
      namedTextFieldValue,
      dataSampleTextFieldValue
    } = this.state;

    return (
      <DiscoverSelectorComponent
        discoveryIsLoading={discoveryIsLoading}
        discoveryLoadingLabel={discoveryLoadingLabel}
        tabValue={tabValue}
        onHandleTabChange={this.handleTabChange}
        dataSourcesUris={dataSourcesUris}
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
        namedGraph={namedGraph}
        onHandleChangeIndex={this.handleChangeIndex}
        sparqlTextFieldValue={sparqlTextFieldValue}
        namedTextFieldValue={namedTextFieldValue}
        dataSampleTextFieldValue={dataSampleTextFieldValue}
      />
    );
  }
}

DiscoverSelectorContainer.propTypes = {
  changeTab: PropTypes.func,
  dataSampleIri:  PropTypes.string,
  dataSourcesUris: PropTypes.string,
  namedGraph:  PropTypes.string,
  sparqlEndpointIri:  PropTypes.string,
  tabValue:  PropTypes.number
};

const mapStateToProps = state => {
  return {
    datasources: discoverySelectors.getDatasourcesArray(state.datasources),
    discoveryId: state.globals.discoveryId,
    dataSourcesUris: state.discover.dataSourcesUris,
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    namedGraph: state.discover.namedGraph,
    tabValue: state.discover.tabValue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverSelectorContainer);
