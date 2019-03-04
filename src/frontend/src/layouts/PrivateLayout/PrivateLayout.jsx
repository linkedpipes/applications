import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { NavigationBar } from '@components';
import { withAuthorization } from '@inrupt/solid-react-components';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography/Typography';

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

const PrivateLayout = ({ classes, component: Component, webId, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Fragment>
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
            <Component {...matchProps} />
          </main>
        </Fragment>
      )}
    />
  );
};

PrivateLayout.propTypes = {
  classes: PropTypes.any,
  component: PropTypes.any,
  webId: PropTypes.any
};

export default withAuthorization(withStyles(styles)(PrivateLayout));
