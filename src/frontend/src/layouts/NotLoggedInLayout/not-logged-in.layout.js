import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { withWebId } from "@inrupt/solid-react-components";

const NotLoggedInLayout = ({ component: Component, webId, ...rest }) => {
  return !webId ? (
    <Route
      {...rest}
      render={matchProps => (
        <Fragment>
          <Component {...matchProps} />
        </Fragment>
      )}
    />
  ) : (
    <Redirect to="/welcome" />
  );
};

export default withWebId(NotLoggedInLayout);
