import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';

const styles = {
  root: {
    flexGrow: 1
  },
  textField: {
    flexGrow: 1
  }
};

const VisualizerControllerLabelsComponent = ({
  classes,
  title,
  onTitleChange
}) => (
  <div className={classes.root}>
    <MapIcon style={{ fontSize: '70px' }} />
    <TextField
      label="App title"
      className={classes.textField}
      value={title}
      placeholder="Enter your app Title"
      onChange={onTitleChange}
      margin="normal"
    />
  </div>
);

VisualizerControllerLabelsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default withStyles(styles)(VisualizerControllerLabelsComponent);
