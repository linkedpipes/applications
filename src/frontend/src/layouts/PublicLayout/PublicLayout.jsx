import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withWebId } from '@utils';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = () => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  }
});

const PublicLayout = ({ classes, component: Component, webId, ...rest }) => {
  return !webId ? (
    <Route
      {...rest}
      render={matchProps => (
        <main className={classes.content}>
          <Component {...matchProps} />
        </main>
      )}
    />
  ) : (
    <Redirect to="/dashboard" />
  );
};

PublicLayout.propTypes = {
  classes: PropTypes.any,
  component: PropTypes.any,
  webId: PropTypes.any
};

export default withWebId(withStyles(styles)(PublicLayout));
