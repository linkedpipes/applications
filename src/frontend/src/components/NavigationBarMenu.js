import React from "react";
import { Link } from "react-router";
import Button from "@material-ui/core/Button";
import { Toolbar, Typography, withStyles } from "@material-ui/core";
import * as appRoutes from "../routers/AppRouter";

const styles = {
  flex: {
    flexGrow: 1
  }
};

const NavigationBarMenu = props => {
  const { classes } = props;
  return (
    <Toolbar>
      <Typography variant="display1" color="inherit" className={classes.flex}>
        Discovery API Assistant Demo
      </Typography>
      <Button
        size="large"
        component={Link}
        to={appRoutes.dashboardUrl}
        color="inherit"
      >
        Dashboard
      </Button>
      <Button component={Link} to={appRoutes.aboutUrl} color="inherit">
        Help
      </Button>
    </Toolbar>
  );
};

export default withStyles(styles)(NavigationBarMenu);
