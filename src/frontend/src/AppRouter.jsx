// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import io from 'socket.io-client';
import * as Sentry from '@sentry/browser';
import { userActions } from '@ducks/userDuck';
import ErrorBoundary from 'react-error-boundary';
import { toast, ToastContainer } from 'react-toastify';
import { Invitation } from '@storage/models';
import { discoveryActions } from '@ducks/discoveryDuck';
import { StoragePage, StorageToolbox, StorageInboxDialog } from '@storage';
import { SocketContext, Log, UserService } from '@utils';
import { PrivateLayout, PublicLayout } from '@layouts';
import {
  DiscoverPage,
  HomePage,
  NotFoundPage,
  AboutPage,
  CreateVisualizerPage,
  AuthorizationPage,
  ApplicationPage,
  SettingsPage
} from '@containers';
import {
  DashboardHeader,
  ApplicationHeader,
  SettingsHeader,
  ApplicationsBrowserHeader
} from '@components';

// Socket URL defaults to window.location
// and default path is /socket.io in case
// BASE_SOCKET_URL is not set

let socket;

const startSocketClient = () => {
  socket = io.connect(
    process.env.BASE_SOCKET_URL ? process.env.BASE_SOCKET_URL : undefined,
    {
      reconnection: process.env.SOCKET_RECONNECT
        ? process.env.SOCKET_RECONNECT
        : false
    }
  );
};

const stopSocketClient = () => {
  socket.removeAllListeners();
  socket.disconnect();
};

let socketHasDisconnectedBefore = false;

const styles = () => ({
  root: {}
});

type Props = {
  webId: ?string,
  // eslint-disable-ne
  handleSetSolidUserProfileAsync: Function,
  handleAddDiscoverySession: Function,
  handleAddExecutionSession: Function,
  handleUpdateDiscoverySession: Function,
  handleUpdateExecutionSession: Function,
  handleUpdateApplicationsFolder: Function,
  handleSetUserWebId: Function,
  handleDeleteDiscoverySession: Function,
  handleDeleteExecutionSession: Function,
  handleSetUserInboxInvitations: Function,
  currentInboxInvitations: Function,
  // eslint-disable-next-line react/no-unused-prop-types
  discoverySessions: Array<Object>,
  // eslint-disable-next-line react/no-unused-prop-types
  pipelineExecutions: Array<Object>,
  // eslint-disable-next-line react/no-unused-prop-types
  dataSampleSessionId: string,
  handleSetDataSampleSessionId: Function,
  handleSetDiscoveryId: Function,
  // eslint-disable-next-line react/no-unused-prop-types
  discoveryId: string
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
    });
  };
};

class AppRouter extends React.PureComponent<Props, State> {
  state = {
    isExternalPath: false
  };

  componentDidMount = async () => {
    const pathname = window.location.href;

    if (
      pathname.includes('/map') ||
      pathname.includes('/treemap') ||
      pathname.includes('/chord')
    ) {
      this.setState({ isExternalPath: true });
    } else {
      await this.setupSessionTracker();
    }

    window.onbeforeunload = () => {
      if (
        !this.state.isExternalPath &&
        this.props.webId &&
        socket !== undefined
      ) {
        socket.emit('leave', this.props.webId);
        socket.removeAllListeners();
      }
    };
  };

  setupProfileData = async jsonResponse => {
    const updatedProfileData = jsonResponse;
    const me = await StorageToolbox.getPerson(updatedProfileData.webId);
    await this.props.handleSetSolidUserProfileAsync(
      updatedProfileData,
      me.name,
      me.image
    );
  };

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

          toast.info(
            `${invitation.sender.name} - accepted your invitation to collaborate!`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 4000
            }
          );
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

      if (invitations.length > 0) {
        toast.info(`New notifications received! Check your inbox.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000
        });
      }
    }
  };

  setupSessionTracker = async () => {
    const { handleSetUserWebId, handleUpdateApplicationsFolder } = this.props;
    const self = this;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    authClient.trackSession(session => {
      if (session) {
        handleSetUserWebId(session.webId);

        Log.info(session);
        self.startSocketListeners();

        UserService.getUserProfile(session.webId)
          .then(res => {
            Log.info('Response from get user profile call:', 'UserService');
            Log.info(res, 'UserService');
            Log.info(res.data, 'UserService');

            return res.data;
          })
          .then(async jsonResponse => {
            await self.setupProfileData(jsonResponse);

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
        // eslint-disable-next-line no-lonely-if
        if (socket !== undefined) {
          socket.removeAllListeners();
        }
      }
    });
  };

  startSocketListeners() {
    const {
      handleAddDiscoverySession,
      handleAddExecutionSession,
      handleUpdateDiscoverySession,
      handleUpdateExecutionSession,
      handleDeleteDiscoverySession,
      handleDeleteExecutionSession,
      handleSetDataSampleSessionId,
      handleSetDiscoveryId,
      webId
    } = this.props;

    const self = this;

    if (socket) {
      // restart if there is an instance already
      stopSocketClient();
    }
    startSocketClient();

    socket.on('connect', () => {
      if (socket.connected) {
        Log.info('Client connected', 'AppRouter');
        Log.info(socket.id, 'AppRouter');
        if (socket && socketHasDisconnectedBefore) {
          // restart if there is an instance already
          Log.info('Socket has disconnected before');
          socketHasDisconnectedBefore = false;
          self.startSocketListeners();
          socket.emit('join', webId);
        }
      }
    });

    socket.on('disconnect', () => {
      Log.info('Client disconnected', 'AppRouter');
      Log.info(socket.id, 'AppRouter');
      socketHasDisconnectedBefore = true;
    });

    socket.on('reconnect', () => {
      if (socket.connected) {
        Log.info('Client reconnected', 'AppRouter');
        Log.info(socket.id, 'AppRouter');
        if (socket && socketHasDisconnectedBefore) {
          Log.info('Socket has disconnected before');
          socketHasDisconnectedBefore = false;
          self.startSocketListeners();
          socket.emit('join', webId);
        }
      }
    });

    socket.on('discoveryAdded', data => {
      if (data === undefined) {
        return;
      }
      const parsedData = JSON.parse(data);
      const sessionId = parsedData.sessionId || undefined;
      if (sessionId === self.props.dataSampleSessionId) {
        handleSetDataSampleSessionId(undefined);
        handleSetDiscoveryId(parsedData.discoveryId);
      }
      socket.emit('join', parsedData.discoveryId);
      handleAddDiscoverySession(parsedData);
    });

    socket.on('discoveryDeleted', data => {
      Log.info(socket.id);
      const senderSocketId = data.socketId;
      const currentSocketId = socket.id;

      if (
        senderSocketId &&
        currentSocketId &&
        senderSocketId !== currentSocketId
      ) {
        const discoveryId = data.discoveryId;
        handleDeleteDiscoverySession(discoveryId);
      }
    });

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
      pipelineRecord.frequencyHours = parsedData.frequencyHours;
      pipelineRecord.startedByUser = parsedData.startedByUser;
      pipelineRecord.scheduleOn = parsedData.scheduleOn;

      socket.emit('join', pipelineRecord.executionIri);
      handleAddExecutionSession(pipelineRecord);
    });

    socket.on('executionDeleted', data => {
      Log.info(socket.id);
      const senderSocketId = data.socketId;
      const currentSocketId = socket.id;

      if (
        senderSocketId &&
        currentSocketId &&
        senderSocketId !== currentSocketId
      ) {
        const executionIri = data.executionIri;
        handleDeleteExecutionSession(executionIri);
      }
    });

    socket.on('discoveryStatus', data => {
      if (data === undefined) {
        return;
      }
      const parsedData = JSON.parse(data);
      if (parsedData.status.isFinished) {
        if (parsedData.discoveryId !== self.props.discoveryId) {
          socket.emit('leave', parsedData.discoveryId);
        }
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
    const { webId } = this.props;
    return (
      <ErrorBoundary onError={errorHandler(webId)}>
        <BrowserRouter>
          <SocketContext.Provider value={socket}>
            <Switch>
              <PublicLayout component={AuthorizationPage} path="/login" exact />

              <PrivateLayout
                path="/dashboard"
                component={HomePage}
                headerComponent={DashboardHeader}
                headerTitle={'Dashboard'}
                exact
              />

              <PrivateLayout
                path="/config-application"
                component={CreateVisualizerPage}
                headerComponent={ApplicationHeader}
                headerTitle={'Application Control & Setup'}
                exact
              />

              <PrivateLayout
                path="/create-application"
                component={DiscoverPage}
                headerTitle={'Create Application'}
                exact
              />

              <PrivateLayout
                path="/settings"
                component={SettingsPage}
                headerComponent={SettingsHeader}
                headerTitle={'Settings'}
                exact
              />

              <PrivateLayout
                path="/about"
                component={AboutPage}
                headerTitle={'FAQ'}
                exact
              />

              <PrivateLayout
                path="/applications"
                component={StoragePage}
                headerComponent={ApplicationsBrowserHeader}
                headerTitle={'Applications Browser'}
                exact
              />

              <Route path="/404" component={NotFoundPage} exact />

              <Route path="/map" component={ApplicationPage} />

              <Route path="/treemap" component={ApplicationPage} />

              <Route path="/chord" component={ApplicationPage} />

              <Route path="/timeline" component={ApplicationPage} />

              <Redirect from="/" to="/login" exact />
              <Redirect to="/404" />
            </Switch>
            <StorageInboxDialog />
          </SocketContext.Provider>
        </BrowserRouter>

        <ToastContainer />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = state => {
  return {
    webId: state.user.webId,
    userProfile: state.user,
    colorThemeIsLight: state.user.colorThemeIsLight,
    chooseFolderDialogIsOpen: state.globals.chooseFolderDialogIsOpen,
    discoverySessions: state.user.discoverySessions,
    pipelineExecutions: state.user.pipelineExecutions,
    currentInboxInvitations: state.user.inboxInvitations,
    dataSampleSessionId: state.discovery.dataSampleSessionId,
    discoveryId: state.discovery.discoveryId
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

  const handleDeleteDiscoverySession = discoveryId =>
    dispatch(userActions.deleteDiscoverySession({ discoveryId }));

  const handleAddExecutionSession = executionSession =>
    dispatch(userActions.addExecutionSession({ session: executionSession }));

  const handleDeleteExecutionSession = executionIri =>
    dispatch(userActions.deleteExecutionSession({ executionIri }));

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

  return {
    handleSetSolidUserProfileAsync,
    handleSetUserWebId,
    handleAddDiscoverySession,
    handleAddExecutionSession,
    handleDeleteDiscoverySession,
    handleDeleteExecutionSession,
    handleUpdateDiscoverySession,
    handleUpdateExecutionSession,
    handleUpdateApplicationsFolder,
    handleUpdateUserDetails,
    handleSetUserInboxInvitations,
    handleSetDiscoveryId,
    handleSetDataSampleSessionId
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(AppRouter)));
