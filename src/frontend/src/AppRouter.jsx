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
import StorageDashboard from "./components/SOLID/StorageDashboard";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import { AuthRoute, UnauthRoute } from "react-router-auth";
import AuthenticationScreen from "./components/Authentication/AuthenticationScreen";
import connect from "react-redux/lib/connect/connect";

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
            <UnauthRoute
              path="/login"
              component={AuthenticationScreen}
              redirectTo="/dashboard"
              authenticated={props.authenticationStatus}
            />

            <AuthRoute
              path="/dashboard"
              component={Dashboard}
              redirectTo="/login"
              authenticated={props.authenticationStatus}
            />

            <AuthRoute
              path="/create-app"
              component={CreateApp}
              redirectTo="/login"
              authenticated={props.authenticationStatus}
            />

            <AuthRoute
              path="/select-sources"
              component={StepperController}
              redirectTo="/login"
              authenticated={props.authenticationStatus}
            />

            <AuthRoute
              path="/about"
              component={AboutPage}
              redirectTo="/login"
              authenticated={props.authenticationStatus}
            />

            <AuthRoute
              component={NotFoundPage}
              redirectTo="/login"
              authenticated={props.authenticationStatus}
            />
            <Route path="/storage" component={StorageDashboard} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

const mapStateToProps = state => {
  return {
    authenticationStatus:
      state.globals.authenticationStatus !== undefined
        ? state.globals.authenticationStatus
        : false
  };
};

export default connect(mapStateToProps)(
  withRoot(withStyles(styles)(AppRouter))
);
