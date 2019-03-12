import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

const NotFoundPageComponent = ({ classes }) => (
  <div className={classes.root}>
    <Typography variant="h1" gutterBottom>
      404
    </Typography>
    <Typography variant="h2" gutterBottom>
      Page not found...
    </Typography>
  </div>
);

NotFoundPageComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotFoundPageComponent);
