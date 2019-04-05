import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withAuthorization } from '@inrupt/solid-react-components';

const PrivateLayout = ({ routes, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Fragment>
          <Fragment>
            <Switch>
              {routes.map(route => (
                <Route key={route.id} {...route} exact />
              ))}
              <Redirect to="/404" />
            </Switch>
          </Fragment>
        </Fragment>
      )}
    />
  );
};

export default withAuthorization(PrivateLayout);
