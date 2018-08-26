import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import NavigationBar from "../components/NavigationBar";
import AssistantDemoPage from "../components/AssistantDemoPage";
import AboutPage from "../components/AboutPage";
import BottomBar from "../components/BottomBar";
import withRoot from "../components/withRoot";

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <NavigationBar />
      <Switch>
        <Route path={dashboardUrl} component={AssistantDemoPage} exact={true} />
        <Route path={aboutUrl} component={AboutPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <BottomBar />
    </div>
  </BrowserRouter>
);

export default withRoot(AppRouter);

// "Named" routes

export const dashboardUrl = "/";
export const aboutUrl = "/about";
