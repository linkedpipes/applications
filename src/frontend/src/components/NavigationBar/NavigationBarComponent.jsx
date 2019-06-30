// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import UserProfileButton from '../UserProfile';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/MenuTwoTone';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeftTwoTone';
import ChevronRightIcon from '@material-ui/icons/ChevronRightTwoTone';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import StorageIcon from '@material-ui/icons/StorageTwoTone';
import HelpIcon from '@material-ui/icons/Help';
import classNames from 'classnames';
import { withRouter } from 'react-router';

const drawerWidth = 240;

const styles = theme => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: '4rem'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    position: 'relative',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8)
    }
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    height: '4rem'
  },
  chevronWrapper: {
    textAlign: 'right'
  },
  chevron: {
    marginTop: '0.5rem'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }
});

type Props = {
  classes: Object,
  drawerState: Boolean,
  history: Object,
  onHandleDrawerClose: Function,
  onHandleDrawerOpen: Function,
  theme: Object
};

const NavigationBar = ({
  classes,
  theme,
  drawerState,
  onHandleDrawerClose,
  onHandleDrawerOpen,
  history
}: Props) => (
  <div>
    <AppBar
      position="absolute"
      className={classNames(classes.appBar, {
        [classes.appBarShift]: drawerState
      })}
    >
      <Toolbar disableGutters={!drawerState} className={classes.toolbar}>
        <div className={classes.toolbarIcon}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={onHandleDrawerOpen}
            className={classNames(classes.menuButton, {
              [classes.hide]: drawerState
            })}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <Typography
          color="inherit"
          variant="h6"
          className={classes.flex}
          noWrap
        >
          LinkedPipes Applications
        </Typography>
        <UserProfileButton />
      </Toolbar>
      <ToastContainer className="toast-container" />
    </AppBar>

    <Drawer
      variant="permanent"
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: drawerState,
        [classes.drawerClose]: !drawerState
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: drawerState,
          [classes.drawerClose]: !drawerState
        })
      }}
      open={drawerState}
    >
      <div className={classNames(classes.toolbar, classes.chevronWrapper)}>
        <IconButton className={classes.chevron} onClick={onHandleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          id="dashboard_navbar_button"
          button
          onClick={() => {
            history.push('/dashboard');
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* <Link style={{ textDecoration: 'none' }} to="/create-app">
          <ListItem button>
            <ListItemIcon>
              <ViewModuleIcon/>
            </ListItemIcon>
            <ListItemText primary="Applications"/>
          </ListItem>
        </Link> */}

        <ListItem
          id="storage_navbar_button"
          button
          onClick={() => {
            history.push('/storage');
          }}
        >
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Storage" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            history.push('/about');
          }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </Drawer>
  </div>
);

export const NavigationBarComponentDemo = withTheme(
  withStyles(styles, { withTheme: true })(NavigationBar)
);

export const NavigationBarComponent = withRouter(
  withTheme(withStyles(styles, { withTheme: true })(NavigationBar))
);
