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
import { SocketContext, Log } from '@utils';
import io from 'socket.io-client';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from 'react-error-boundary';

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
  userId: ?string
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
                    path="/create-app"
                    component={CreateVisualizerPage}
                    exact
                  />
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
    userId: state.user.webId
  };
};

export default connect(mapStateToProps)(
  withRoot(withStyles(styles)(AppRouter))
);
