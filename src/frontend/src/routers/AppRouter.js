import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import NavigationBar from "../components/NavigationBar";
import AssistantDemoPage from "../components/AssistantDemoPage";
import AboutPage from "../components/AboutPage";
import Assistant from "../components/Assistant";

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <NavigationBar />
      <Switch>
        <Route path="/" component={AssistantDemoPage} exact={true} />
        <Route path="/about" component={AboutPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;

// "Named" routes

export const dashboardUrl = () => {
  return "/";
};

export const aboutUrl = () => {
  return "/about";
};
