// @flow
import React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import SettingsIcon from '@material-ui/icons/SettingsTwoTone';
import LogoutIcon from '@material-ui/icons/ExitToAppTwoTone';
import HelpIcon from '@material-ui/icons/HelpTwoTone';
import NotificationsIcon from '@material-ui/icons/NotificationsTwoTone';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Hidden,
  Toolbar,
  AppBar,
  Tooltip,
  Typography
} from '@material-ui/core';
import { GlobalConstants } from '@constants/';

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
  onHandleLogoutClicked: Function,
  onHandleOpenSettings: Function,
  onHandleSetInboxDialogOpen: Function,
  currentInboxInvitations: Array<Object>,
  onDrawerToggle: Function,
  headerTitle: string
};

const HeaderControls = ({
  classes,
  onHandleLogoutClicked,
  onHandleOpenSettings,
  onHandleSetInboxDialogOpen,
  currentInboxInvitations,
  onDrawerToggle,
  headerTitle
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
                onClick={onDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item xs />
          <Grid item>
            <Tooltip title="Documentation • Go to platform documentation">
              <IconButton
                color="inherit"
                href={GlobalConstants.DOCUMENTATION_URL}
                target="_blank"
                // onClick={onHandleOpenSettings}
                className={classes.iconButtonAvatar}
              >
                <HelpIcon className={classes.avatar} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Notifications • No notifications">
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
            <Tooltip title="Settings • Go to settings">
              <IconButton
                color="inherit"
                onClick={onHandleOpenSettings}
                className={classes.iconButtonAvatar}
              >
                <SettingsIcon className={classes.avatar} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Logout • Logout from platform">
              <IconButton
                color="inherit"
                onClick={onHandleLogoutClicked}
                className={classes.iconButtonAvatar}
              >
                <LogoutIcon className={classes.avatar} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography color="inherit" variant="h5" component="h1">
              {headerTitle}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export const HeaderControlsComponent = withStyles(styles)(HeaderControls);
