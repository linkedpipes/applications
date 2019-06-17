// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  GoogleMapsVisualizer,
  TreemapVisualizer,
  ChordVisualizer
} from '@components';
import { VISUALIZER_TYPE } from '@constants';
import Typography from '@material-ui/core/Typography';
import FiltersComponent from '../Filters/FiltersComponent';
import { pathOr } from 'rambda';

type Props = {
  classes: { root: {}, filterSideBar: {}, containerView: {}, vizdiv: {} },
  visualizer: { visualizerCode: string },
  selectedResultGraphIri: string,
  selectedPipelineExecution: string,
  handleSetCurrentApplicationData: Function,
  selectedApplication: Object,
  selectedApplicationMetadata: Object,
  height: number,
  width: number,
  selectedNodes?: Set<string>,
  filtersState: {}
};

const styles = theme => ({
  root: {
    flex: 1
  },
  vizdiv: {
    overflow: 'hidden'
  },
  containerView: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
  },
  filterSideBar: {
    overflowY: 'hidden'
  },
  card: {},
  input: {}
});

const getVisualizer = (
  visualizerCode,
  selectedResultGraphIri,
  selectedPipelineExecution,
  selectedApplication,
  handleSetCurrentApplicationData,
  selectedApplicationMetadata,
  classes,
  selectedNodes,
  width,
  height,
  filtersState
) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP: {
      return (
        <GoogleMapsVisualizer
          isPublished={selectedApplicationMetadata !== undefined}
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          isPublished={selectedApplicationMetadata !== undefined}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          schemes={pathOr(
            [],
            'filterGroups.schemeFilter.options',
            filtersState
          )}
        />
      );
    case VISUALIZER_TYPE.CHORD:
      return (
        <ChordVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          isPublished={selectedApplicationMetadata !== undefined}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          height={height}
          width={width}
          nodes={pathOr([], 'filterGroups.nodesFilter.options', filtersState)}
        />
      );
    case VISUALIZER_TYPE.UNDEFINED:
      return (
        <div className={classes.containerView}>
          <Typography variant="h2" gutterBottom>
            No visualizers selected...
          </Typography>
        </div>
      );
    default:
      return <div>No valid visualizer selected.</div>;
  }
};

const VisualizerControllerContainer = (props: Props) => {
  return (
    <Grid container className={props.classes.root} direction="row" spacing={10}>
      <Grid item lg={4} md={5} xs={12} className={props.classes.filterSideBar}>
        <FiltersComponent
          editingMode
          filtersState={props.filtersState}
          selectedResultGraphIri={props.selectedResultGraphIri}
        />
      </Grid>

      <Grid
        id="viz-div"
        className={props.classes.vizdiv}
        item
        lg={8}
        md={7}
        xs={12}
      >
        {getVisualizer(
          props.visualizer.visualizerCode,
          props.selectedResultGraphIri,
          props.selectedPipelineExecution,
          props.selectedApplication,
          props.handleSetCurrentApplicationData,
          props.selectedApplicationMetadata,
          props.classes,
          props.selectedNodes,
          props.width,
          props.height,
          props.filtersState
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(VisualizerControllerContainer);
