import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFoundPage from "./containers/NotFoundPage";
import { NavigationBar } from "./components/Navbar";
import AboutPage from "./containers/AboutPage";
import BottomBar from "./components/BottomBar/BottomBar";
import withRoot from "./withRoot";
import Redirect from "react-router-dom/es/Redirect";
import { Dashboard } from "./components/Dashboard/Dashboard";
import StepperController from "./components/SelectSources/StepperController";
import CreateApp from "./components/CreateApp/CreateApp";
import Grid from "@material-ui/core/Grid";

const AppRouter = () => (
  <BrowserRouter>
    <Grid container direction="column">
      <Grid item md={12} lg={12}>
        <NavigationBar />
      </Grid>
      <Grid item md={12} lg={12}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/create-app" component={CreateApp} />
          <Route exact path="/select-sources" component={StepperController} />
          <Route path="/about" component={AboutPage} />
          <Redirect from="/" to="/dashboard" />
          <Route component={NotFoundPage} />
        </Switch>
      </Grid>
      <Grid item>
        <BottomBar />
      </Grid>
    </Grid>
  </BrowserRouter>
);

export default withRoot(AppRouter);
