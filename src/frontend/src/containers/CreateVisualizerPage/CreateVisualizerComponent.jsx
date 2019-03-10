// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

type Props = {
  selectedVisualizer: any,
  headerParams?: any,
  filters: any,
  classes: {
    root: {}
  }
};

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
}: Props) => (
  <div className={classes.root}>
    <VisualizerControllerHeader headerParams={headerParams} />
    <VisualizerContainer
      filters={filters}
      visualizer={selectedVisualizer.visualizer}
    />
  </div>
);

export default withStyles(styles)(CreateVisualizerComponent);
