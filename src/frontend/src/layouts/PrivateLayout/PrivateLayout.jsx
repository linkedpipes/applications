import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { NavigationBar, Header } from '@components';
import { withStyles } from '@material-ui/core/styles';
import { withAuthorization } from '@utils';
import Typography from '@material-ui/core/Typography/Typography';
import Hidden from '@material-ui/core/Hidden';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { CssBaseline } from '@material-ui/core';

const drawerWidth = 256;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0'
  }
});
type Props = {
  classes: any,
  component: any,
  webId: any,
  drawerState: Boolean,
  handleSetMobileDrawerState: Function
};

const PrivateLayout = ({
  classes,
  component: Component,
  webId,
  drawerState,
  handleSetMobileDrawerState,
  ...rest
}: Props) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <div className={classes.root}>
          <CssBaseline />
          <nav className={classes.drawer}>
            <Hidden smUp implementation="js">
              <NavigationBar
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={drawerState}
                onClose={() => {
                  handleSetMobileDrawerState(!drawerState);
                }}
              />
            </Hidden>
            <Hidden xsDown implementation="css">
              <NavigationBar PaperProps={{ style: { width: drawerWidth } }} />
            </Hidden>
          </nav>
          <div className={classes.appContent}>
            <Header
              onDrawerToggle={() => {
                handleSetMobileDrawerState(!drawerState);
              }}
            />
            <main className={classes.mainContent}>
              <Component {...matchProps} />
            </main>
          </div>
        </div>
      )}
    />
  );
};

const mapStateToProps = state => {
  return {
    drawerState: state.globals.drawerState
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetMobileDrawerState = drawerState =>
    dispatch(globalActions.setMobileDrawerState(drawerState));

  return {
    handleSetMobileDrawerState
  };
};

export default withAuthorization(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(PrivateLayout)
  )
);
