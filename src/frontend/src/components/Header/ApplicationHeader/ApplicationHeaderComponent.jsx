// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

type Props = {
  classes: Object,
  onDrawerToggle: Function,
  sectionLabel: string,
  tabTitles: [{ titleLabel: string }],
  onHandleTabChange: Function,
  applicationSetupTabIndex: Number
};

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

function ApplicationHeader(props: Props) {
  const {
    classes,
    onDrawerToggle,
    sectionLabel,
    tabTitles,
    onHandleTabChange,
    applicationSetupTabIndex
  } = props;

  return (
    <React.Fragment>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {sectionLabel}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs
          value={applicationSetupTabIndex}
          textColor="inherit"
          onChange={onHandleTabChange}
        >
          {tabTitles.map(({ titleLabel }) => (
            <Tab textColor="inherit" label={titleLabel} />
          ))}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

export const ApplicationHeaderComponent = withStyles(styles)(ApplicationHeader);
