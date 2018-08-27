import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Typography, withStyles } from "@material-ui/core";

const styles = {
  flex: {
    flexGrow: 1
  }
};

const NavigationBar = props => {
  const { classes } = props;
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Discovery API Assistant Demo
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default withStyles(styles)(NavigationBar);
