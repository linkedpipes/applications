import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFoundPage from "./containers/NotFoundPage";
import { NavigationBar } from "./components/Navbar";
import AboutPage from "./containers/AboutPage";
import BottomBar from "./components/BottomBar/BottomBar";
import withRoot from "./withRoot";
import Redirect from "react-router-dom/es/Redirect";
import { Dashboard } from "./components/Dashboard/Dashboard";
import CreateAppStepper from "./components/SelectSources/CreateAppStepper";
import CreateApp from "./components/CreateApp/CreateApp";
import Grid from "@material-ui/core/Grid";

const AppRouter = () => (
  <BrowserRouter>
    <Grid container direction="column">
      <Grid item>
        <NavigationBar />
      </Grid>
      <Grid item>
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
      </Grid>
      <Grid item>
        <BottomBar />
      </Grid>
    </Grid>
  </BrowserRouter>
);

export default withRoot(AppRouter);
