// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { VisualizerControllerHeader, VisualizerContainer } from './children';

type Props = {
  selectedVisualizer: any,
  selectedApplication: any,
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
    flex: 1,
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
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
  selectedApplication,
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
      selectedApplication={selectedApplication}
    />
  </div>
);

export default withStyles(styles)(CreateVisualizerComponent);
