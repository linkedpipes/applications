// @flow
import React, { PureComponent } from 'react';
import HomeComponent from './HomeComponent';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId, withAuthorization } from '@inrupt/solid-react-components';
import { discoverActions } from '../DiscoverPage/duck';
import { etlActions } from '@ducks/etlDuck';
import { globalActions } from '@ducks/globalDuck';
import {
  Log,
  SocketContext,
  ETLService,
  ETL_STATUS_TYPE,
  ETL_STATUS_MAP
} from '@utils';
import axios from 'axios';

type Props = {
  history: { push: any },
  onInputExampleClicked: (sample: {}) => void,
  // eslint-disable-next-line react/no-unused-prop-types
  userProfile: Object,
  socket: Object,
  handleSetResultPipelineIri: Function,
  handleSetSelectedVisualizer: Function,
  handleUpdateDiscoverySession: Function,
  handleUpdateExecutionSession: Function
};
type State = {
  tabIndex: number
};

class HomeContainer extends PureComponent<Props, State> {
  state = {
    tabIndex: 0
  };

  componentDidMount() {
    const {
      socket,
      handleUpdateDiscoverySession,
      handleUpdateExecutionSession
    } = this.props;
    const { setupDiscoveryListeners, setupEtlExecutionsListeners } = this;
    const self = this;

    setupDiscoveryListeners();
    setupEtlExecutionsListeners();

    socket.on('discoveryStatus', data => {
      if (data === undefined) {
        return;
      }
      const parsedData = JSON.parse(data);
      if (parsedData.status.isFinished) {
        socket.emit('leave', parsedData.discoveryId);
        const userProfile = self.props.userProfile;
        if (userProfile.discoverySessions.length > 0) {
          const discoveryRecord = {};

          discoveryRecord.discoveryId = parsedData.discoveryId;
          discoveryRecord.isFinished = parsedData.status.isFinished;
          discoveryRecord.finished = parsedData.finished;
          discoveryRecord.sparqlEndpointIri = parsedData.sparqlEndpointIri;
          discoveryRecord.namedGraph = parsedData.namedGraph;
          discoveryRecord.dataSampleIri = parsedData.dataSampleIri;

          handleUpdateDiscoverySession(discoveryRecord);
        }
      }
    });

    socket.on('executionStatus', data => {
      if (data === undefined) {
        return;
      }

      const parsedData = JSON.parse(data);
      const executionIri = parsedData.executionIri;
      const newStatus = parsedData.status.status;

      socket.emit('leave', executionIri);
      const userProfile = self.props.userProfile;
      if (userProfile.pipelineExecutions.length > 0) {
        const pipelineRecord = {};
        pipelineRecord.status = newStatus;
        pipelineRecord.finished = parsedData.finished;
        pipelineRecord.executionIri = executionIri;

        handleUpdateExecutionSession(pipelineRecord);
      }
    });
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener('discoveryStatus');
    socket.removeListener('executionStatus');
  }

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
      const status = ETL_STATUS_MAP[rawStatus.statusIri]
        ? ETL_STATUS_MAP[rawStatus.statusIri]
        : ETL_STATUS_MAP[rawStatus['@id']];
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
    this.setState({ tabIndex });
  };

  handleSampleClick = sample => {
    return () => {
      const { onInputExampleClicked, history } = this.props;
      if (sample.type === 'ttlFile') {
        axios
          .get(sample.fileUrl)
          .then(response => {
            const sampleWithUris = sample;
            sampleWithUris.dataSourcesUris = response.data;
            onInputExampleClicked(sampleWithUris);
          })
          .catch(error => {
            // handle error
            Log.error(error, 'DiscoverExamplesContainer');
          });
      } else {
        onInputExampleClicked(sample);
      }
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

  render() {
    const {
      handleChange,
      handleSampleClick,
      handleSelectDiscoveryClick,
      onHandleSelectPipelineExecutionClick
    } = this;
    const { userProfile } = this.props;
    const { tabIndex } = this.state;

    return (
      <div>
        <HomeComponent
          onHandleTabChange={handleChange}
          onHandleSampleClick={handleSampleClick}
          onHandleSelectDiscoveryClick={handleSelectDiscoveryClick}
          onHandleSelectPipelineExecutionClick={
            onHandleSelectPipelineExecutionClick
          }
          applicationsList={userProfile.applications}
          pipelinesList={userProfile.pipelineExecutions}
          discoveriesList={userProfile.discoverySessions}
          tabIndex={tabIndex}
        />
      </div>
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
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = sample =>
    dispatch(discoverActions.setSelectedInputExample(sample));

  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfileAsync(userProfile));

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

  const handleUpdateDiscoverySession = discoverySession =>
    dispatch(userActions.updateDiscoverySession({ session: discoverySession }));

  const handleUpdateExecutionSession = executionSession =>
    dispatch(userActions.updateExecutionSession({ session: executionSession }));

  return {
    handleSetUserProfile,
    onInputExampleClicked,
    handleSetResultPipelineIri,
    handleSetSelectedVisualizer,
    handleUpdateDiscoverySession,
    handleUpdateExecutionSession
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withWebId(HomeContainerWithSocket))
);
