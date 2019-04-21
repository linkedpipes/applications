// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizerControllerHeader, VisualizerContainer } from './children';
import LoadingOverlay from 'react-loading-overlay';

type Props = {
  selectedVisualizer: any,
  selectedApplication: any,
  headerParams?: any,
  filters: any,
  selectedResultGraphIri: string,
  classes: {
    root: {}
  },
  handleSetCurrentApplicationData: Function,
  setApplicationLoaderStatus: Function,
  loadingIsActive: boolean
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
  handleSetCurrentApplicationData,
  setApplicationLoaderStatus,
  loadingIsActive
}: Props) => (
  <LoadingOverlay className={classes.root} active={loadingIsActive} spinner>
    <VisualizerControllerHeader
      headerParams={headerParams}
      onRefreshSwitchChange={() => {}}
      setApplicationLoaderStatus={setApplicationLoaderStatus}
    />
    <VisualizerContainer
      filters={filters}
      visualizer={selectedVisualizer.visualizer}
      selectedResultGraphIri={selectedResultGraphIri}
      handleSetCurrentApplicationData={handleSetCurrentApplicationData}
      selectedApplication={selectedApplication}
    />
  </LoadingOverlay>
);

export default withStyles(styles)(CreateVisualizerComponent);
