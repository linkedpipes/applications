// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';

const lightColor = 'rgba(255, 255, 255, 0.7)';

type Props = {
  classes: Object,
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
  const { classes, tabTitles, onHandleTabChange, settingsTabIndex } = props;

  return (
    <React.Fragment>
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
            <Tab key={uuid()} textColor="inherit" label={titleLabel} />
          ))}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

export const SettingsHeaderComponent = withStyles(styles)(SettingsHeader);
