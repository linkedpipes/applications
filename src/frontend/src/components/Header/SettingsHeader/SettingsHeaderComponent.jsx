// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

type Props = {
  classes: Object,
  sectionLabel: string,
  tabTitles: [{ titleLabel: string }],
  onHandleTabChange: Function,
  settingsTabIndex: Number
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

function SettingsHeader(props: Props) {
  const {
    classes,
    sectionLabel,
    tabTitles,
    onHandleTabChange,
    settingsTabIndex
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
          value={settingsTabIndex}
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

export const SettingsHeaderComponent = withStyles(styles)(SettingsHeader);