// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

type Props = {
  selectedVisualizer: any,
  headerParams?: any,
  filters: any,
  selectedResultGraphIri: string,
  classes: {
    root: {}
  },
  handleSetCurrentApplicationData: Function
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
  filters,
  selectedResultGraphIri,
  handleSetCurrentApplicationData
}: Props) => (
  <div className={classes.root}>
    <VisualizerControllerHeader
      headerParams={headerParams}
      onRefreshSwitchChange={() => {}}
    />
    <VisualizerContainer
      filters={filters}
      visualizer={selectedVisualizer.visualizer}
      selectedResultGraphIri={selectedResultGraphIri}
      handleSetCurrentApplicationData={handleSetCurrentApplicationData}
    />
  </div>
);

export default withStyles(styles)(CreateVisualizerComponent);
