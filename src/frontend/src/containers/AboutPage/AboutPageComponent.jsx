import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';

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

const AboutPageComponent = ({ classes }) => (
  <div className={classes.root}>
    <Typography variant="h1" gutterBottom>
      FAQ
    </Typography>
    <Typography variant="h2" gutterBottom>
      To be implemented...
    </Typography>
    <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
  </div>
);

AboutPageComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AboutPageComponent);
