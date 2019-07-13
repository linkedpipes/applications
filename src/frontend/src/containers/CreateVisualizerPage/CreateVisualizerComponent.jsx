// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  VisualizerControllerHeader,
  EditVisualizerHeader,
  VisualizerContainer
} from './children';
import LoadingOverlay from 'react-loading-overlay';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';
import { Container } from '@material-ui/core';

type Props = {
  selectedVisualizer: any,
  selectedApplication: any,
  selectedApplicationMetadata: ApplicationMetadata,
  headerParams?: any,
  filters: any,
  selectedResultGraphIri: string,
  selectedPipelineExecution: string,
  classes: {
    root: {},
    cardGrid: {}
  },
  handleSetCurrentApplicationData: Function,
  setApplicationLoaderStatus: Function,
  loadingIsActive: boolean,
  width: number,
  height: number,
  selectedNodes?: Set<string>,
  filtersState: {}
};

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {},
  input: {}
});

const CreateVisualizer = ({
  classes,
  selectedVisualizer,
  headerParams,
  filters,
  selectedResultGraphIri,
  selectedPipelineExecution,
  selectedApplication,
  selectedApplicationMetadata,
  handleSetCurrentApplicationData,
  setApplicationLoaderStatus,
  loadingIsActive,
  selectedNodes,
  width,
  height,
  filtersState
}: Props) => (
  <LoadingOverlay active={loadingIsActive} spinner>
    <main>
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

      <Container className={classes.cardGrid} maxWidth="xl">
        <VisualizerContainer
          filters={filters}
          visualizer={selectedVisualizer.visualizer}
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          selectedApplication={selectedApplication}
          selectedApplicationMetadata={selectedApplicationMetadata}
          width={width}
          height={height}
          selectedNodes={selectedNodes}
          filtersState={filtersState}
        />
      </Container>
    </main>
  </LoadingOverlay>
);

export const CreateVisualizerComponent = withStyles(styles)(CreateVisualizer);
