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
  ApplicationPage,
  UserProfilePage,
  SettingsPage
} from '@containers';
import { PrivateLayout, PublicLayout } from '@layouts';
import { SocketContext, Log, AuthenticationService } from '@utils';
import { StoragePage, StorageToolbox, StorageInboxDialog } from '@storage';
import io from 'socket.io-client';
import * as Sentry from '@sentry/browser';
import { userActions } from '@ducks/userDuck';
import ErrorBoundary from 'react-error-boundary';
import { toast } from 'react-toastify';
import withTracker from './withTracker';
import GoogleAnalytics from 'react-ga';
import { Invitation } from '@storage/models';

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
    display: 'flex',
    height: '100vh'
  }
});

type Props = {
  classes: any,
  webId: ?string,
  // eslint-disable-ne
  handleSetSolidUserProfileAsync: Function,
  handleAddDiscoverySession: Function,
  handleAddExecutionSession: Function,
  handleUpdateDiscoverySession: Function,
  handleUpdateExecutionSession: Function,
  handleUpdateApplicationsFolder: Function,
  handleSetUserWebId: Function,
  handleSetUserInboxInvitations: Function,
  discoverySessions: Array<Object>,
  pipelineExecutions: Array<Object>,
  currentInboxInvitations: Array<Object>,
  webId: string
};

type State = {
  isExternalPath: boolean
};

const errorHandler = webId => {
  return (error: Error, componentStack: string) => {
    Log.error(componentStack, 'AppRouter');
    Sentry.withScope(scope => {
      scope.setUser({ id: webId || 'unidentified user' }); // How can we capture WEBID from here
      scope.setLevel('error');
      scope.setExtra('component-stack', componentStack);
      Sentry.captureException(error);
      Sentry.showReportDialog(); // Only if not production
    });
  };
};

class AppRouter extends React.PureComponent<Props, State> {
  state = {
    isExternalPath: false
  };

  componentDidMount() {
    const pathname = window.location.href;

    if (
      pathname.includes('/map') ||
      pathname.includes('/treemap') ||
      pathname.includes('/chord')
    ) {
      this.setState({ isExternalPath: true });
    } else {
      this.setupSessionTracker();
    }

    window.onbeforeunload = () => {
      if (!this.state.isExternalPath) {
        socket.emit('leave', this.props.webId);
        socket.removeAllListeners();
      }
    };
  }

  checkInbox = async () => {
    const {
      webId,
      handleSetUserInboxInvitations,
      currentInboxInvitations
    } = this.props;
    const inboxInvitations = await StorageToolbox.getInboxMessages(webId);
    const invitations = [];

    await Promise.all(
      inboxInvitations.map(async fileUrl => {
        const invitation = await StorageToolbox.readInboxInvite(fileUrl, webId);

        if (invitation instanceof Invitation) {
          Log.info(invitation);
          invitations.push(invitation);
        } else {
          await StorageToolbox.processAcceptShareInvite(invitation);
        }
      })
    );

    if (
      !(
        currentInboxInvitations.length === invitations.length &&
        currentInboxInvitations.sort().every((value, index) => {
          return (
            value.invitationUrl === invitations.sort()[index].invitationUrl
          );
        })
      )
    ) {
      handleSetUserInboxInvitations(invitations);
    }
  };

  setupProfileData = async jsonResponse => {
    const updatedProfileData = jsonResponse;
    const me = await StorageToolbox.getPerson(updatedProfileData.webId);
    this.props.handleSetSolidUserProfileAsync(
      updatedProfileData,
      me.name,
      me.image
    );
  };

  setupSessionTracker = async () => {
    const { handleSetUserWebId, handleUpdateApplicationsFolder } = this.props;
    const self = this;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    authClient.trackSession(session => {
      if (session) {
        GoogleAnalytics.set({ webId: session.webId });

        handleSetUserWebId(session.webId);

        Log.info(session);
        self.startSocketListeners();

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
          .then(async jsonResponse => {
            self.setupProfileData(jsonResponse);

            socket.emit('join', session.webId);

            const folder = await StorageToolbox.getValidAppFolder(
              session.webId
            ).catch(async error => {
              Log.error(error, 'HomeContainer');
              await StorageToolbox.createAppFolders(
                session.webId,
                'linkedpipes'
              ).then(created => {
                if (!created) {
                  toast.error('Error creating app folders, try again.', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000
                  });
                }
              });
            });

            if (folder) {
              Log.warn('Called internal global');
              handleUpdateApplicationsFolder(folder);
              await self.checkInbox();
              setInterval(self.checkInbox, 10000);
            }
          })
          .catch(error => {
            Log.error(error, 'HomeContainer');
          });

        Log.warn('Called global');
      } else {
        socket.removeAllListeners();
      }
    });
  };

  startSocketListeners() {
    const {
      handleAddDiscoverySession,
      handleAddExecutionSession,
      handleUpdateDiscoverySession,
      handleUpdateExecutionSession
    } = this.props;

    socket.removeAllListeners();

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
        if (self.props.discoverySessions.length > 0) {
          const discoveryRecord = {};

          discoveryRecord.discoveryId = parsedData.discoveryId;
          discoveryRecord.isFinished = parsedData.status.isFinished;
          discoveryRecord.finished = parsedData.finished;
          discoveryRecord.sparqlEndpointIri = parsedData.sparqlEndpointIri;
          discoveryRecord.namedGraph = parsedData.namedGraph;
          discoveryRecord.dataSampleIri = parsedData.dataSampleIri;

          handleUpdateDiscoverySession(discoveryRecord);

          toast.info(`Discovery session has finished!\nCheck your dashboard.`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          });
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
      if (self.props.pipelineExecutions.length > 0) {
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
  }

  render() {
    const { classes, webId } = this.props;
    return (
      <div>
        <ErrorBoundary onError={errorHandler(webId)}>
          <BrowserRouter>
            <div className={classes.root}>
              <SocketContext.Provider value={socket}>
                <Switch>
                  <PublicLayout
                    component={withTracker(AuthorizationPage)}
                    path="/login"
                    exact
                  />

                  <PrivateLayout
                    path="/dashboard"
                    component={withTracker(HomePage)}
                    exact
                  />

                  <PrivateLayout
                    path="/create-app"
                    component={withTracker(CreateVisualizerPage)}
                    exact
                  />

                  <PrivateLayout
                    path="/discover"
                    component={DiscoverPage}
                    exact
                  />

                  <PrivateLayout
                    path="/profile"
                    component={withTracker(UserProfilePage)}
                    exact
                  />

                  <PrivateLayout
                    path="/settings"
                    component={SettingsPage}
                    exact
                  />

                  <PrivateLayout
                    path="/about"
                    component={withTracker(AboutPage)}
                    exact
                  />

                  <PrivateLayout
                    path="/storage"
                    component={withTracker(StoragePage)}
                    exact
                  />

                  <PublicLayout
                    path="/404"
                    component={withTracker(NotFoundPage)}
                    exact
                  />

                  <Route path="/map" component={ApplicationPage} />

                  <Route path="/treemap" component={ApplicationPage} />

                  <Route path="/chord" component={ApplicationPage} />

                  <Redirect from="/" to="/login" exact />
                  <Redirect to="/404" />
                </Switch>
                <StorageInboxDialog />
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
    webId: state.user.webId,
    discoverySessions: state.user.discoverySessions,
    pipelineExecutions: state.user.pipelineExecutions,
    currentInboxInvitations: state.user.inboxInvitations,
    colorThemeIsLight: state.globals.colorThemeIsLight
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSolidUserProfileAsync = (
    userProfile,
    solidUsername,
    solidImage
  ) =>
    dispatch(
      userActions.setSolidUserProfileAsync(
        userProfile,
        solidUsername,
        solidImage
      )
    );

  const handleSetUserWebId = webId => dispatch(userActions.setUserWebId(webId));

  const handleAddDiscoverySession = discoverySession =>
    dispatch(userActions.addDiscoverySession({ session: discoverySession }));

  const handleAddExecutionSession = executionSession =>
    dispatch(userActions.addExecutionSession({ session: executionSession }));

  const handleUpdateDiscoverySession = discoverySession =>
    dispatch(userActions.updateDiscoverySession({ session: discoverySession }));

  const handleUpdateExecutionSession = executionSession =>
    dispatch(userActions.updateExecutionSession({ session: executionSession }));

  const handleUpdateApplicationsFolder = value =>
    dispatch(userActions.updateApplicationsFolder({ value }));

  const handleUpdateUserDetails = actions => {
    Promise.all(actions).then(changes => {
      dispatch(changes);
    });
  };

  const handleSetUserInboxInvitations = inboxInvitations =>
    dispatch(userActions.setUserInboxInvitations(inboxInvitations));

  return {
    handleSetSolidUserProfileAsync,
    handleSetUserWebId,
    handleAddDiscoverySession,
    handleAddExecutionSession,
    handleUpdateDiscoverySession,
    handleUpdateExecutionSession,
    handleUpdateApplicationsFolder,
    handleUpdateUserDetails,
    handleSetUserInboxInvitations
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(AppRouter)));
