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
import clsx from 'clsx';

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  itemActiveItem: {
    color: '#4fc3f7'
  },
  itemPrimary: {
    fontSize: 'inherit'
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  drawer: {
    width: '256px'
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
  history,
  ...other
}: Props) => (
  <Drawer classes={classes.drawer} variant="permanent" {...other}>
    <List disablePadding>
      <ListItem
        className={clsx(classes.firebase, classes.item, classes.itemCategory)}
      >
        Paperbase
      </ListItem>
      <ListItem className={clsx(classes.item, classes.itemCategory)}>
        <ListItemIcon className={classes.itemIcon}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classes.itemPrimary
          }}
        >
          Project Overview
        </ListItemText>
      </ListItem>

      <React.Fragment key={'general-list-item-section'}>
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary
            }}
          >
            General
          </ListItemText>
        </ListItem>

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

        <Divider className={classes.divider} />

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

        <Divider className={classes.divider} />

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

        {process.env.NODE_ENV !== 'production' && (
          <ListItem>
            <ListItemText primary="Development Build" />
          </ListItem>
        )}
      </React.Fragment>
    </List>
  </Drawer>
);

export const NavigationBarComponentDemo = withTheme(
  withStyles(styles, { withTheme: true })(NavigationBar)
);

export const NavigationBarComponent = withRouter(
  withTheme(withStyles(styles, { withTheme: true })(NavigationBar))
);
