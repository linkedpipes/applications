// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscoveryService, extractUrlGroups, SocketContext, Log } from '@utils';
import { discoveryActions, discoverySelectors } from '@ducks/discoveryDuck';
import { discoverActions } from '../duck';
import DiscoverSelectorComponent from './DiscoverSelectorComponent';
import { withWebId } from '@inrupt/solid-react-components';

type Props = {
  changeTab: number => void,
  dataSampleIri: string,
  dataSourcesUris: string,
  handleSetDiscoveryId: any,
  handleSetPipelineGroups: any,
  namedGraph: string,
  onNextClicked: any,
  socket: any,
  sparqlEndpointIri: string,
  tabValue: number,
  webId: string
};

type State = {
  ttlFile: any,
  discoveryIsLoading: boolean,
  textFieldValue: string,
  textFieldIsValid: boolean,
  discoveryLoadingLabel: string,
  sparqlTextFieldValue: string,
  dataSampleTextFieldValue: string,
  namedTextFieldValue: string
};

class DiscoverSelectorContainer extends PureComponent<Props, State> {
  state = {
    ttlFile: undefined,
    discoveryIsLoading: false,
    textFieldValue: '',
    textFieldIsValid: false,
    discoveryLoadingLabel: '',
    sparqlTextFieldValue: '',
    dataSampleTextFieldValue: '',
    namedTextFieldValue: ''
  };

  componentWillUnmount = () => {
    const { socket } = this.props;
    socket.off('discoveryStatus');
  };

  postStartFromFile = async instance => {
    return DiscoveryService.postDiscoverFromTtl({
      ttlFile: instance.state.ttlFile,
      webId: instance.props.webId
    }).then(response => {
      return response;
    });
  };

  // TODO: refactor later, move to separate class responsible for _services calls
  postStartFromInputLinks = async instance => {
    const { dataSourcesUris } = instance.props;
    const { textFieldIsValid } = instance.state;
    if (!dataSourcesUris && !textFieldIsValid) {
      toast.error(
        'There was an error during the discovery. Please, try different sources.',
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        }
      );
      return undefined;
    }
    const splitFieldValue = dataSourcesUris.split(',\n');
    const datasourcesForTTL = splitFieldValue.map(source => {
      return { uri: source };
    });

    return DiscoveryService.postDiscoverFromUriList({
      datasourceUris: datasourcesForTTL,
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
    if (this.props.tabValue === 1) {
      return this.postStartFromSparqlEndpoint(instance);
    }
    if (this.state.ttlFile) {
      return this.postStartFromFile(instance);
    }
    return this.postStartFromInputLinks(instance);
  };

  handleProcessStartDiscovery = () => {
    const self = this;
    const { handleSetDiscoveryId } = this.props;

    self.setState({
      discoveryIsLoading: true,
      discoveryLoadingLabel:
        'Please, hold on Discovery is casting spells 🧙‍...'
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

  startSocketListener = discoveryId => {
    const { socket, onNextClicked } = this.props;
    const self = this;

    socket.emit('join', discoveryId);
    socket.on('discoveryStatus', data => {
      socket.emit('leave', discoveryId);
      socket.off('discoveryStatus');

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

  // Handle when the text in the SPARQL
  // endpoint textfields changes
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
    tabValue: state.discover.tabValue
  };
};

const mapDispatchToProps = dispatch => {
  const changeTab = index => dispatch(discoverActions.changeTabAction(index));
  const handleSetDiscoveryId = discoveryId =>
    dispatch(
      discoveryActions.addDiscoveryIdAction({
        id: discoveryId
      })
    );

  const handleSetPipelineGroups = pipelineGroups =>
    dispatch(discoveryActions.setPipelineGroupsAction(pipelineGroups));

  return {
    changeTab,
    handleSetDiscoveryId,
    handleSetPipelineGroups
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebId(DiscoverSelectorContainerWithSocket));
