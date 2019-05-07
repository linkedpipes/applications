// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  VisualizerControllerHeader,
  EditVisualizerHeader,
  VisualizerContainer
} from './children';
import LoadingOverlay from 'react-loading-overlay';
import AppConfiguration from '@storage/models/AppConfiguration';

type Props = {
  selectedVisualizer: any,
  selectedApplication: any,
  selectedApplicationMetadata: AppConfiguration,
  headerParams?: any,
  filters: any,
  selectedResultGraphIri: string,
  classes: {
    root: {}
  },
  handleSetCurrentApplicationData: Function,
  setApplicationLoaderStatus: Function,
  loadingIsActive: boolean,
  width: number,
  height: number,
  selectedNodes?: Set<string>
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
  selectedApplicationMetadata,
  handleSetCurrentApplicationData,
  setApplicationLoaderStatus,
  loadingIsActive,
  selectedNodes,
  width,
  height
}: Props) => (
  <LoadingOverlay className={classes.root} active={loadingIsActive} spinner>
    {selectedApplicationMetadata ? (
      <EditVisualizerHeader
        headerParams={headerParams}
        onRefreshSwitchChange={() => {}}
        setApplicationLoaderStatus={setApplicationLoaderStatus}
        selectedApplicationMetadata={selectedApplicationMetadata}
      />
    ) : (
      <VisualizerControllerHeader
        headerParams={headerParams}
        onRefreshSwitchChange={() => {}}
        setApplicationLoaderStatus={setApplicationLoaderStatus}
      />
    )}
    <VisualizerContainer
      filters={filters}
      visualizer={selectedVisualizer.visualizer}
      selectedResultGraphIri={selectedResultGraphIri}
      handleSetCurrentApplicationData={handleSetCurrentApplicationData}
      selectedApplication={selectedApplication}
      selectedApplicationMetadata={selectedApplicationMetadata}
      width={width}
      height={height}
      selectedNodes={selectedNodes}
    />
  </LoadingOverlay>
);

export default withStyles(styles)(CreateVisualizerComponent);
