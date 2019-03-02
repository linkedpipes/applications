import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import VisualizerControllerHeader 


const VisualizerComponent = ({
    classes,
    selectedVisualizer,
    headerParams
  }) => (
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
    classes: PropTypes.object.isRequired,
    headerParams: PropTypes.object,
    selectedVisualizer: PropTypes.number
    checkedRefresh: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    onTitleChange: PropTypes.func.isRequired
  };
  
  export default withStyles(styles)(VisualizerComponent);