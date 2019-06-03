// @flow
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

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

type Props = {
  classes: Object,
  component: Object,
  webId: string,
  location: Object
};

const PublicLayout = ({
  classes,
  component: Component,
  webId,
  location,
  ...rest
}: Props) => {
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
    <Redirect
      to={`${!location.state ? '/dashboard' : location.state.prevPath}`}
    />
  );
};

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

export default connect(mapStateToProps)(withStyles(styles)(PublicLayout));
