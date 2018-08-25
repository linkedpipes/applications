import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import NavigationBarMenu from "./NavigationBarMenu";

const NavigationBar = props => {
  const { classes } = props;
  return (
    <header>
      <AppBar position="static">
        <NavigationBarMenu />
      </AppBar>
    </header>
  );
};

export default NavigationBar;
