import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFoundPage from "./containers/NotFoundPage";
import { NavigationBar } from "./components/Navbar";
import AboutPage from "./containers/AboutPage";
import withRoot from "./withRoot";
import Redirect from "react-router-dom/es/Redirect";
import { Dashboard } from "./components/Dashboard/Dashboard";
import StepperController from "./components/SelectSources/StepperController";
import CreateApp from "./components/CreateApp/CreateApp";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  devBar: {
    fontSize: "1rem",
    height: "2rem",
    paddingBottom: "0.5rem",
    paddingTop: "0.5rem",
    fontWeight: "bold",
    color: "#606060",
    textAlign: "center",
    verticalAlign: "middle",
    background: "#ffdb4d",
    width: "100%"
  }
});

const AppRouter = props => {
  const { classes } = props;
  return (
    <BrowserRouter>
      <div className={classes.root}>
        <NavigationBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <CssBaseline />
          {process.env.NODE_ENV !== "production" && (
            <div className={classes.devBar}>DEVELOPMENT MODE</div>
          )}
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/create-app" component={CreateApp} />
            <Route exact path="/select-sources" component={CreateAppStepper} />
            {/*<Route path="/create-app" component={AboutPage} />*/}
            <Route path="/about" component={AboutPage} />
            {/*<Route path="/login" component={AboutPage} />*/}
            {/*<Route path="/register" component={AboutPage} />*/}
            <Redirect from="/" to="/dashboard" />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default withRoot(withStyles(styles)(AppRouter));
