import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { NavigationBar } from '@components';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Log, AuthenticationService, withAuthorization } from '@utils';
import { StorageToolbox } from '@storage';
import { userActions } from '@ducks/userDuck';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography/Typography';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexFlow: 'column',
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
  )(withStyles(styles)(PrivateLayout))
);
