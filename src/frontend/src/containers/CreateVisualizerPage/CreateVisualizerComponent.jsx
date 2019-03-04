import React from 'react';
import PropTypes from 'prop-types';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

const VisualizerComponent = ({
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
      visualizerType={selectedVisualizer}
    />
  </div>
);

VisualizerComponent.propTypes = {
  // checkedRefresh: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  // handleChange: PropTypes.func.isRequired,
  headerParams: PropTypes.object,
  // onTitleChange: PropTypes.func.isRequired,
  selectedVisualizer: PropTypes.string.isRequired
};

export default VisualizerComponent;
