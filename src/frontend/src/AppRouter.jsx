import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import NotFoundPage from "./containers/NotFoundPage";
import NavigationBar from "./components/navbar/NavigationBar";
import AssistantDemoPage from "./components/AssistantDemoPage";
import AboutPage from "./containers/AboutPage";
import BottomBar from "./components/bottom-bar/BottomBar";
import withRoot from "./withRoot";

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
