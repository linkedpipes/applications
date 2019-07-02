// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import StorageIcon from '@material-ui/icons/StorageTwoTone';
import HelpIcon from '@material-ui/icons/Help';
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
  itemDevBuild: {
    fontSize: 14
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  history: Object,
  theme: Object
};

type State = {
  selectedItem: string
};

class NavigationBarContainer extends PureComponent<Props, State> {
  state = {
    selectedItem: 'dashboard'
  };

  render() {
    const { classes, theme, history, ...other } = this.props;
    const { selectedItem } = this.state;

    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem
            className={clsx(
              classes.firebase,
              classes.item,
              classes.itemCategory
            )}
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

            <Divider className={classes.divider} />

            <ListItem
              id="dashboard_navbar_button"
              button
              selected={selectedItem === 'dashboard'}
              onClick={() => {
                history.push('/dashboard');
                this.setState({ selectedItem: 'dashboard' });
              }}
            >
              <ListItemIcon className={classes.itemIcon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary
                }}
                primary="Dashboard"
              />
            </ListItem>

            <ListItem
              id="storage_navbar_button"
              button
              selected={selectedItem === 'storage'}
              onClick={() => {
                history.push('/storage');
                this.setState({ selectedItem: 'storage' });
              }}
            >
              <ListItemIcon className={classes.itemIcon}>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary
                }}
                primary="Storage"
              />
            </ListItem>

            <ListItem
              button
              selected={selectedItem === 'about'}
              onClick={() => {
                history.push('/about');
                this.setState({ selectedItem: 'about' });
              }}
            >
              <ListItemIcon className={classes.itemIcon}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary
                }}
                primary="About"
              />
            </ListItem>

            {process.env.NODE_ENV !== 'production' && (
              <ListItem>
                <ListItemText
                  classes={{
                    primary: classes.itemDevBuild
                  }}
                  primary="Development Build"
                />
              </ListItem>
            )}
          </React.Fragment>
        </List>
      </Drawer>
    );
  }
}

export const NavigationBarDemo = withStyles(styles)(NavigationBarContainer);

export const NavigationBar = withStyles(styles)(
  withRouter(NavigationBarContainer)
);
