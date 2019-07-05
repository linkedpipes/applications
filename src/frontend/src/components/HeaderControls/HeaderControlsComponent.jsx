// @flow
import React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Menu from '@material-ui/core/Menu/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import RemoveIcon from '@material-ui/icons/Remove';
import AccountCircle from '@material-ui/icons/AccountCircleTwoTone';
import NotificationsIcon from '@material-ui/icons/NotificationsTwoTone';
import Badge from '@material-ui/core/Badge';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Hidden,
  Toolbar,
  AppBar,
  Tooltip
} from '@material-ui/core';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  secondaryBar: {
    zIndex: 0
  },
  menuButton: {
    marginLeft: -theme.spacing(1)
  },
  iconButtonAvatar: {
    padding: 4
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white
    }
  },
  button: {
    borderColor: lightColor
  }
});

type Props = {
  classes: Object,
  anchorElement: Object,
  onHandleLogoutClicked: Function,
  onHandleMenuClose: Function,
  onHandleMenuOpen: Function,
  profileMenuIsOpen: Function,
  onHandleOpenProfile: Function,
  onHandleOpenSettings: Function,
  onHandleSetInboxDialogOpen: Function,
  currentInboxInvitations: Array<Object>
};

const HeaderControls = ({
  classes,
  anchorElement,
  profileMenuIsOpen,
  onHandleMenuClose,
  onHandleMenuOpen,
  onHandleLogoutClicked,
  onHandleOpenProfile,
  onHandleOpenSettings,
  onHandleSetInboxDialogOpen,
  currentInboxInvitations
}: Props) => (
  <React.Fragment>
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar>
        <Grid container spacing={1} alignItems="center">
          <Hidden smUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                // onClick={onDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item xs />
          <Grid item>
            <Typography className={classes.link} component="a" href="#">
              Go to docs
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Alerts • No alters">
              <IconButton color="inherit" onClick={onHandleSetInboxDialogOpen}>
                <Badge
                  badgeContent={(currentInboxInvitations || []).length}
                  color="secondary"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <IconButton
              color="inherit"
              onClick={onHandleMenuOpen}
              className={classes.iconButtonAvatar}
            >
              <AccountCircle className={classes.avatar} />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>

    <Menu
      anchorEl={anchorElement}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={profileMenuIsOpen}
      onClose={onHandleMenuClose}
    >
      <MenuItem onClick={onHandleOpenProfile}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      <MenuItem onClick={onHandleOpenSettings}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
      <MenuItem onClick={onHandleLogoutClicked}>
        <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  </React.Fragment>
);

export const HeaderControlsComponent = withStyles(styles)(HeaderControls);
