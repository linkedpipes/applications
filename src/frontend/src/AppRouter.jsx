import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from 'react-router-dom/es/Redirect';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Typography from '@material-ui/core/Typography';
import { PrivateRoute } from '@inrupt/solid-react-components';
import { NavigationBar } from '@components';
import {
  DiscoverPage,
  HomePage,
  NotFoundPage,
  AboutPage,
  CreateVisualizerPage,
  AuthorizationPage
} from '@containers';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  devBar: {
    fontSize: '1rem',
    height: '3rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    verticalAlign: 'middle',
    background: '#525C62',
    width: '100%'
  }
});

const AppRouter = props => {
  const { classes } = props;
  return (
    <BrowserRouter>
      <div className={classes.root}>
        <NavigationBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <CssBaseline />
          {process.env.NODE_ENV !== 'production' && (
            <div className={classes.devBar}>
              <Typography variant="subtitle1" noWrap>
                Development Build
              </Typography>
            </div>
          )}
          <Switch>
            <Route component={AuthorizationPage} path="/login" exact />

            <PrivateRoute
              path="/dashboard"
              component={HomePage}
              redirect="/login"
            />

            <PrivateRoute
              path="/create-app"
              component={CreateVisualizerPage}
              redirect="/login"
            />

            <PrivateRoute
              path="/discover"
              component={DiscoverPage}
              redirect="/login"
            />

            <PrivateRoute
              path="/about"
              component={AboutPage}
              redirect="/login"
            />

            <Route path="/404" component={NotFoundPage} exact />

            <Redirect from="/" to="/login" exact />
            <Redirect to="/404" />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default withRoot(withStyles(styles)(AppRouter));
