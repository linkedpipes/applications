import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFoundPage from "./containers/NotFoundPage";
import { NavigationBar } from "./components/Navbar";
import { CreateApp } from "./components/CreateApp";
import AboutPage from "./containers/AboutPage";
import BottomBar from "./components/BottomBar/BottomBar";
import withRoot from "./withRoot";
import Redirect from "react-router-dom/es/Redirect";

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <NavigationBar />
      <Switch>
        <Route exact path="/dashboard" component={CreateApp} />
        {/*<Route path="/create-app" component={AboutPage} />*/}
        <Route path="/about" component={AboutPage} />
        {/*<Route path="/login" component={AboutPage} />*/}
        {/*<Route path="/register" component={AboutPage} />*/}
        <Redirect from="/" to="/dashboard"/>
        <Route component={NotFoundPage} />
      </Switch>
      <BottomBar />
    </div>
  </BrowserRouter>
);

export default withRoot(AppRouter);
