// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import {
  DiscoverPage,
  HomePage,
  NotFoundPage,
  AboutPage,
  CreateVisualizerPage,
  AuthorizationPage,
  StoragePage,
  ApplicationPage
} from '@containers';
import { PrivateLayout, PublicLayout } from '@layouts';
import {
  SocketContext,
  Log,
  AuthenticationService,
  StorageToolbox
} from '@utils';
import io from 'socket.io-client';
import * as Sentry from '@sentry/browser';
import { userActions } from '@ducks/userDuck';
import ErrorBoundary from 'react-error-boundary';
import auth from 'solid-auth-client';
import { toast } from 'react-toastify';

// Socket URL defaults to window.location
// and default path is /socket.io in case
// BASE_SOCKET_URL is not set
const socket = io.connect(
  process.env.BASE_SOCKET_URL ? process.env.BASE_SOCKET_URL : undefined,
  {
    reconnection: process.env.SOCKET_RECONNECT
      ? process.env.SOCKET_RECONNECT
      : false
  }
);

const styles = () => ({
  root: {
    display: 'flex'
  }
});

type Props = {
  classes: any,
  userId: ?string,
  // eslint-disable-next-line react/no-unused-prop-types
  userProfile: Object,
  handleSetUserProfile: Function,
  handleAddDiscoverySession: Function,
  handleAddExecutionSession: Function,
  handleUpdateDiscoverySession: Function,
  handleUpdateExecutionSession: Function
};

const errorHandler = userId => {
  return (error: Error, componentStack: string) => {
    Log.error(componentStack, 'AppRouter');
    Sentry.withScope(scope => {
      scope.setUser({ id: userId || 'unidentified user' }); // How can we capture WEBID from here
      scope.setLevel('error');
      scope.setExtra('component-stack', componentStack);
      Sentry.captureException(error);
      Sentry.showReportDialog(); // Only if not production
    });
  };
};

class AppRouter extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      handleSetUserProfile,
      handleAddDiscoverySession,
      handleAddExecutionSession,
      handleUpdateDiscoverySession,
      handleUpdateExecutionSession
    } = this.props;

    socket.on('connect', data => {
      Log.warn('Client connected', 'AppRouter');
      Log.warn(data, 'AppRouter');
      Log.warn(socket.id, 'AppRouter');
    });
    socket.on('disconnect', data => {
      Log.warn('Client disconnected', 'AppRouter');
      Log.warn(data, 'AppRouter');
      Log.warn(socket.id, 'AppRouter');
    });
    socket.on('reconnect', data => {
      Log.warn('Client reconnected', 'AppRouter');
      Log.warn(data, 'AppRouter');
      Log.warn(socket.id, 'AppRouter');
    });

    socket.on('discoveryAdded', data => {
      if (data === undefined) {
        return;
      }
      const parsedData = JSON.parse(data);
      socket.emit('join', parsedData.discoveryId);
      handleAddDiscoverySession(parsedData);
    });

    const self = this;

    socket.on('executionAdded', data => {
      if (data === undefined) {
        return;
      }

      const parsedData = JSON.parse(data);
      const executionIri = parsedData.executionIri;
      const newStatus = parsedData.status;

      const pipelineRecord = {};
      pipelineRecord.status = newStatus;
      pipelineRecord.selectedVisualiser = parsedData.selectedVisualiser;
      pipelineRecord.etlPipelineIri = parsedData.etlPipelineIri;
      pipelineRecord.started = parsedData.started;
      pipelineRecord.finished = parsedData.finished;
      pipelineRecord.executionIri = executionIri;

      socket.emit('join', pipelineRecord.executionIri);
      handleAddExecutionSession(pipelineRecord);
    });

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

          toast.info(
            `Discovery session at has finished!\nCheck your dashboard.`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 4000
            }
          );
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
        pipelineRecord.started = parsedData.started;
        pipelineRecord.finished = parsedData.finished;
        pipelineRecord.executionIri = executionIri;

        handleUpdateExecutionSession(pipelineRecord);

        toast.info(`Pipeline execution has finished!\nCheck your dashboard.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000
        });
      }
    });

    auth.trackSession(session => {
      if (session) {
        Log.info(session);
        AuthenticationService.getUserProfile(session.webId)
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
            handleSetUserProfile(jsonResponse);
            socket.emit('join', session.webId);
          })
          .catch(error => {
            Log.error(error, 'HomeContainer');
          });

        StorageToolbox.createOrUpdateFolder(session.webId, 'public/lpapps');
      }
    });
  }

  componentWillUnmount() {
    socket.removeAllListeners();
  }

  render() {
    const { classes, userId } = this.props;
    return (
      <div>
        <ErrorBoundary onError={errorHandler(userId)}>
          <BrowserRouter>
            <div className={classes.root}>
              <SocketContext.Provider value={socket}>
                <Switch>
                  <PublicLayout
                    component={AuthorizationPage}
                    path="/login"
                    exact
                  />
                  <PrivateLayout path="/dashboard" component={HomePage} exact />
                  <PrivateLayout
                    path="/create-app"
                    component={CreateVisualizerPage}
                    exact
                  />
                  <PrivateLayout
                    path="/discover"
                    component={DiscoverPage}
                    exact
                  />
                  <PrivateLayout path="/about" component={AboutPage} exact />

                  <PrivateLayout path="/dashboard" component={HomePage} exact />

                  <PrivateLayout
                    path="/discover"
                    component={DiscoverPage}
                    exact
                  />
                  <PrivateLayout
                    path="/storage"
                    component={StoragePage}
                    exact
                  />
                  <PrivateLayout path="/about" component={AboutPage} exact />

                  <PublicLayout path="/404" component={NotFoundPage} exact />
                  <Route path="/map" component={ApplicationPage} />
                  <Route path="/treemap" component={ApplicationPage} />
                  <Route path="/chord" component={ApplicationPage} />
                  <Redirect from="/" to="/login" exact />
                  <Redirect to="/404" />
                </Switch>
              </SocketContext.Provider>
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.webId,
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfile(userProfile));

  const handleAddDiscoverySession = discoverySession =>
    dispatch(userActions.addDiscoverySession({ session: discoverySession }));

  const handleAddExecutionSession = executionSession =>
    dispatch(userActions.addExecutionSession({ session: executionSession }));

  const handleUpdateDiscoverySession = discoverySession =>
    dispatch(userActions.updateDiscoverySession({ session: discoverySession }));

  const handleUpdateExecutionSession = executionSession =>
    dispatch(userActions.updateExecutionSession({ session: executionSession }));

  return {
    handleSetUserProfile,
    handleAddDiscoverySession,
    handleAddExecutionSession,
    handleUpdateDiscoverySession,
    handleUpdateExecutionSession
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(AppRouter)));
