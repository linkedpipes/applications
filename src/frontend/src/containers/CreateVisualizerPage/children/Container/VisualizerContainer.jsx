// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import FiltersComponent from '../Filters/FiltersComponent';
import { pathOr } from 'rambda';
import { VISUALIZER_TYPE } from '@constants';
import {
  MapsVisualizer,
  TreemapVisualizer,
  ChordVisualizer,
  TimelineVisualizer
} from '@components';

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
    overflow: 'hidden',
    flexGrow: 1
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
    case VISUALIZER_TYPE.MAP_WITH_MARKER_FILTERS: {
      return (
        <MapsVisualizer
          isPublished={selectedApplicationMetadata !== undefined}
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          height={height}
          width={width}
          filters={pathOr([], 'filterGroups.mapFilters.filters', filtersState)}
          visualizerCode={visualizerCode}
        />
      );
    }
    case VISUALIZER_TYPE.TIMELINE:
    case VISUALIZER_TYPE.LABELED_TIMELINE:
    case VISUALIZER_TYPE.TIMELINE_PERIODS:
    case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
      return (
        <TimelineVisualizer
          isPublished={selectedApplicationMetadata !== undefined}
          visualizerCode={visualizerCode}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
        />
      );

    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          selectedPipelineExecution={selectedPipelineExecution}
          isPublished={selectedApplicationMetadata !== undefined}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          height={height}
          width={width}
          selectedTopLevelConcepts={pathOr(
            [],
            'filterGroups.nodesFilter.options',
            filtersState
          )}
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
  const renderFilters = ![
    VISUALIZER_TYPE.MAP,
    VISUALIZER_TYPE.LABELED_TIMELINE,
    VISUALIZER_TYPE.TIMELINE,
    VISUALIZER_TYPE.TIMELINE_PERIODS,
    VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS
  ].includes(props.visualizer.visualizerCode);
  return (
    <Grid container className={props.classes.root} direction="row" spacing={10}>
      {renderFilters && (
        <Grid
          item
          lg={4}
          md={5}
          xs={12}
          className={props.classes.filterSideBar}
        >
          <FiltersComponent
            editingMode
            filtersState={props.filtersState}
            selectedResultGraphIri={props.selectedResultGraphIri}
          />
        </Grid>
      )}

      <Grid
        id="viz-div"
        className={props.classes.vizdiv}
        item
        lg={renderFilters ? 8 : 12}
        md={renderFilters ? 7 : 12}
        xs={12}
      >
        <Container maxWidth="xl">
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
        </Container>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(VisualizerControllerContainer);
