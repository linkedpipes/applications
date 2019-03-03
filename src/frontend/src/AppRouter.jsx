import React, { PureComponent } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Redirect from 'react-router-dom/es/Redirect';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import PropTypes from 'prop-types';
import {
  DiscoverPage,
  HomePage,
  NotFoundPage,
  AboutPage,
  CreateVisualizerPage,
  AuthorizationPage
} from '@containers';
import { PrivateLayout, PublicLayout } from '@layouts';
import { SocketContext } from '@utils';
import openSocket from 'socket.io-client';
import { SOCKET_IO_ENDPOINT } from '@constants';

const socket = openSocket(SOCKET_IO_ENDPOINT);

const styles = () => ({
  root: {
    display: 'flex'
  }
});

class AppRouter extends PureComponent {
  componentDidMount() {
    socket.on('connect', () => console.log('Client connected'));
    socket.on('disconnect', () => console.log('Client disconnected'));
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
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
      </div>
    );
  }
}

AppRouter.propTypes = {
  classes: PropTypes.any
};

export default withRoot(withStyles(styles)(AppRouter));
