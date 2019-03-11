import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: '#B2DFDB'
  },
  barColorPrimary: {
    backgroundColor: '#00695C'
  }
};

const LinearLoaderComponent = ({
  classes,
  labelText,
  variant = 'indeterminate'
}) => (
  <div className={classes.root}>
    <Typography align="center" gutterBottom>
      {labelText}
    </Typography>
    <LinearProgress variant={variant} />
  </div>
);

LinearLoaderComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.string.isRequired,
  variant: PropTypes.string
};

export default withStyles(styles)(LinearLoaderComponent);
