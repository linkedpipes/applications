import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

const VisualizerComponent = ({ classes, selectedVisualizer, headerParams }) => (
  <div className={classes.root}>
    <VisualizerControllerHeader headerParams={headerParams} />
    <VisualizerContainer
      className={classes.visualizer}
      filters={filters}
      visualizerType={selectedVisualizer}
      visualizerParams={visualizerParams}
    />
  </div>
);

VisualizerComponent.propTypes = {
  checkedRefresh: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  headerParams: PropTypes.object,
  onTitleChange: PropTypes.func.isRequired,
  selectedVisualizer: PropTypes.number
};

export default VisualizerComponent;
