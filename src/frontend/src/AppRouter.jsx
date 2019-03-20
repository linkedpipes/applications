// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import Redirect from 'react-router-dom/es/Redirect';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import {
  DiscoverPage,
  HomePage,
  NotFoundPage,
  AboutPage,
  CreateVisualizerPage,
  AuthorizationPage
} from '@containers';
import { PrivateLayout, PublicLayout } from '@layouts';
import { SocketContext, Log } from '@utils';
import openSocket from 'socket.io-client';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from 'react-error-boundary';

// Socket URL defaults to window.location
// and default path is /socket.io in case
// BASE_SOCKET_URL is not set
const socket = process.env.BASE_SOCKET_URL
  ? openSocket(process.env.BASE_SOCKET_URL)
  : openSocket(window.location.origin);

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
    socket.on('connect', () => Log.info('Client connected', 'AppRouter'));
    socket.on('disconnect', () => Log.info('Client disconnected', 'AppRouter'));
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

                  <PublicLayout path="/404" component={NotFoundPage} exact />
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
