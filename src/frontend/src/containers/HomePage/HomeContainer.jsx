// @flow
import React, { PureComponent } from 'react';
import HomeComponent from './HomeComponent';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId, withAuthorization } from '@inrupt/solid-react-components';
import { discoverActions } from '../DiscoverPage/duck';
import { Log, AuthenticationService, SocketContext } from '@utils';
import axios from 'axios';

type Props = {
  history: { push: any },
  webId: string,
  onInputExampleClicked: (sample: {}) => void,
  handleSetUserProfile: Function,
  discoveriesList: Array<{ id: string, finished: boolean }>,
  applicationsList: Array<{}>,
  userProfile: Object,
  socket: Object,
  pipelinesList: Array<{
    executionIri: string,
    selectedVisualiser: string,
    status: { '@id'?: string, status?: string },
    webId: string
  }>
};
type State = {
  tabIndex: number
};

class HomeContainer extends PureComponent<Props, State> {
  state = {
    tabIndex: 0
  };

  componentDidMount() {
    const { webId, handleSetUserProfile, socket } = this.props;
    const { setupDiscoveryListeners } = this;
    const self = this;
    AuthenticationService.getUserProfile(webId)
      .then(res => {
        Log.info(
          'Response from get user profile call:',
          'AuthenticationService'
        );
        Log.info(res, 'AuthenticationService');
        Log.info(res.data, 'AuthenticationService');

        return res.data;
      })
      .then(jsonResponse => {
        handleSetUserProfile(jsonResponse).then(() => {
          setupDiscoveryListeners();
        });
      })
      .catch(error => {
        Log.error(error, 'HomeContainer');
      });

    socket.on('discoveryStatus', data => {
      const parsedData = JSON.parse(data);
      const discoveryId = parsedData.discoveryId;
      if (parsedData.status.isFinished) {
        socket.emit('leave', discoveryId);
        const userProfile = self.props.userProfile;
        if (userProfile.discoverySessions.length > 0) {
          const updatedDiscovery = userProfile.discoverySessions.map(
            discoveryRecord => {
              if (discoveryRecord.id === discoveryId) {
                discoveryRecord.finished = true;
                socket.emit('leave', discoveryId);
              }
              return discoveryRecord;
            }
          );
          userProfile.discoverySessions = updatedDiscovery;
          handleSetUserProfile(userProfile);
        }
      }
    });
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener('discoveryStatus');
  }

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

  handleSelectDiscoveryClick = discoveryId => {
    const { history } = this.props;
    Log.info(`About to push with id ${discoveryId}`);
    history.push({
      pathname: '/discover',
      state: { discoveryId }
    });
  };

  onHandleSelectPipelineExecutionClick = pipelineExecution => {
    const { history } = this.props;
    Log.info(`About to push with id ${pipelineExecution}`);
    // const selectedResultGraphIri = pipelineExecution.selectedResultGraphIri;
    // const selectedVisualizer = {
    //   visualizer: { visualizerCode: pipelineExecution.selectedVisualiser }
    // };
    // history.push({
    //   pathname: '/create-app',
    //   state: { discoveryId }
    // });
  };

  render() {
    const {
      handleChange,
      handleSampleClick,
      handleSelectDiscoveryClick,
      onHandleSelectPipelineExecutionClick
    } = this;
    const { discoveriesList, pipelinesList, applicationsList } = this.props;
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
          applicationsList={applicationsList}
          pipelinesList={pipelinesList}
          discoveriesList={discoveriesList}
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
    userProfile: state.user,
    discoveriesList: state.user.discoverySessions,
    pipelinesList: state.user.pipelineExecutions,
    applicationsList: state.user.applications
  };
};

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = sample =>
    dispatch(discoverActions.setSelectedInputExample(sample));
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfileAsync(userProfile));
  return {
    handleSetUserProfile,
    onInputExampleClicked
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withWebId(HomeContainerWithSocket))
);
