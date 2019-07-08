import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { CssBaseline } from '@material-ui/core';
import { withAuthorization } from '@utils';
import { NavigationBar, HeaderControls } from '@components';

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
  headerComponent: any,
  webId: any,
  drawerState: Boolean,
  handleSetMobileDrawerState: Function,
  selectedNavigationItem: string,
  handleSetSelectedNavigationItem: Function
};

class PrivateLayout extends PureComponent<Props> {
  handleSetNavigationItem = item => {
    const { handleSetSelectedNavigationItem } = this.props;
    handleSetSelectedNavigationItem(item);
  };

  render() {
    const {
      classes,
      component: Component,
      headerComponent: HeaderComponent,
      webId,
      drawerState,
      handleSetMobileDrawerState,
      selectedNavigationItem,
      ...rest
    } = this.props;

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
                  selectedNavigationItem={selectedNavigationItem}
                  onHandleSetSelectedNavigationItem={
                    this.handleSetNavigationItem
                  }
                  onClose={() => {
                    handleSetMobileDrawerState(!drawerState);
                  }}
                />
              </Hidden>
              <Hidden xsDown implementation="css">
                <NavigationBar
                  onHandleSetSelectedNavigationItem={
                    this.handleSetNavigationItem
                  }
                  selectedNavigationItem={selectedNavigationItem}
                  PaperProps={{ style: { width: drawerWidth } }}
                />
              </Hidden>
            </nav>
            <div className={classes.appContent}>
              <HeaderControls
                onDrawerToggle={() => {
                  handleSetMobileDrawerState(!drawerState);
                }}
              />
              {HeaderComponent !== undefined && <HeaderComponent />}
              <main className={classes.mainContent}>
                <Component {...matchProps} />
              </main>
            </div>
          </div>
        )}
      />
    );
  }
}
const mapStateToProps = state => {
  return {
    drawerState: state.globals.drawerState,
    selectedNavigationItem: state.globals.selectedNavigationItem
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetMobileDrawerState = drawerState =>
    dispatch(globalActions.setMobileDrawerState(drawerState));

  function handleSetSelectedNavigationItem(item) {
    dispatch(globalActions.setSelectedNavigationItem(item));
  }

  return {
    handleSetMobileDrawerState,
    handleSetSelectedNavigationItem
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
