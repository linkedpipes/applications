import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

const styles = {
  root: {
    justifyContent: 'center',
    flex: 1
  },
  card: {},
  input: {}
};

const CreateVisualizerComponent = ({
  classes,
  selectedVisualizer,
  headerParams,
  filters
}) => (
  <div className={classes.root}>
    <VisualizerControllerHeader headerParams={headerParams} />
    <VisualizerContainer
      className={classes.visualizer}
      filters={filters}
      visualizer={selectedVisualizer.visualizer}
    />
  </div>
);

CreateVisualizerComponent.propTypes = {
  // checkedRefresh: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  filters: PropTypes.array.isRequired,
  // handleChange: PropTypes.func.isRequired,
  headerParams: PropTypes.object,
  // onTitleChange: PropTypes.func.isRequired,
  selectedVisualizer: PropTypes.string.isRequired
};

export default withStyles(styles)(CreateVisualizerComponent);
