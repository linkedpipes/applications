import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { NavigationBar } from '@components';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Log,
  AuthenticationService,
  StorageToolbox,
  withAuthorization
} from '@utils';
import { userActions } from '@ducks/userDuck';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography/Typography';
import lifecycle from 'react-pure-lifecycle';

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

const componentDidMount = props => {
  const { webId, handleSetUserProfile } = props;
  AuthenticationService.getUserProfile(webId)
    .then(res => {
      Log.info('Response from get user profile call:', 'AuthenticationService');
      Log.info(res, 'AuthenticationService');
      Log.info(res.data, 'AuthenticationService');

      return res.data;
    })
    .then(jsonResponse => {
      handleSetUserProfile(jsonResponse);
    })
    .catch(error => {
      Log.error(error, 'HomeContainer');
    });

  StorageToolbox.createOrUpdateFolder(webId, 'public/lpapps');
};

const methods = {
  componentDidMount
};

type Props = {
  classes: any,
  component: any,
  webId: any
};

const PrivateLayout = ({
  classes,
  component: Component,
  webId,
  ...rest
}: Props) => {
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

const mapDispatchToProps = dispatch => {
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfile(userProfile));
  return {
    handleSetUserProfile
  };
};

export default withAuthorization(
  connect(
    null,
    mapDispatchToProps
  )(lifecycle(methods)(withStyles(styles)(PrivateLayout)))
);
