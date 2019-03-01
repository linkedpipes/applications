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

const LinearLoaderComponent = ({ classes, labelText }) => (
  <div className={classes.root}>
    <Typography variant="body1" align="center" gutterBottom>
      {labelText}
    </Typography>
    <LinearProgress />
  </div>
);

LinearLoaderComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.object.isRequired
};

export default withStyles(styles)(LinearLoaderComponent);
