import React, { Fragment } from "react";
import { Route, Link } from "react-router-dom";
import { withWebId } from "@inrupt/solid-react-components";

const PublicLayout = ({ component: Component, webId, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Fragment>
          <Component {...matchProps} />
        </Fragment>
      )}
    />
  );
};

export default withWebId(PublicLayout);
