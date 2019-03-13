// @flow
import React, { PureComponent } from 'react';
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
import { SOCKET_IO_ENDPOINT } from '@constants';
import { ErrorBoundary } from 'react-error-boundary';
import * as Sentry from '@sentry/browser';

const socket = openSocket(SOCKET_IO_ENDPOINT);

const styles = () => ({
  root: {
    display: 'flex'
  }
});

type Props = {
  classes: any
};

const sentryFeedbackErrorHandler = (error: Error, componentStack: string) => {
  Log.error(componentStack, 'AppRouter');
  Sentry.withScope(() => {
    Sentry.captureException(error);
    Sentry.showReportDialog();
  });
};

class AppRouter extends PureComponent<Props> {
  componentDidMount() {
    socket.on('connect', () => Log.info('Client connected', 'AppRouter'));
    socket.on('disconnect', () => Log.info('Client disconnected', 'AppRouter'));
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <ErrorBoundary onError={sentryFeedbackErrorHandler}>
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

export default withRoot(withStyles(styles)(AppRouter));
