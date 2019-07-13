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
  tabTitles: [{ titleLabel: string, id: string }],
  onHandleTabChange: Function,
  dashboardTabIndex: Number
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

function DashboardHeader(props: Props) {
  const { classes, tabTitles, onHandleTabChange, dashboardTabIndex } = props;

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
          value={dashboardTabIndex}
          textColor="inherit"
          onChange={onHandleTabChange}
        >
          {tabTitles.map(({ titleLabel, id }) => (
            <Tab key={uuid()} textColor="inherit" id={id} label={titleLabel} />
          ))}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

export const DashboardHeaderComponent = withStyles(styles)(DashboardHeader);
