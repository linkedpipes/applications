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
import TreemapFiltersComponent from '../Filters/children/TreemapFilter';
import ChordFiltersComponent from '../Filters/children/ChordFilter';

type Props = {
  classes: { root: {}, filterSideBar: {}, containerView: {}, vizdiv: {} },
  visualizer: { visualizerCode: string },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  selectedApplication: Object,
  selectedApplicationMetadata: Object,
  height: number,
  width: number,
  selectedNodes?: Set<string>
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
    paddingTop: theme.spacing.unit * 20
  },
  filterSideBar: {
    overflowY: 'hidden'
  },
  card: {},
  input: {}
});

const getFilters = (visualizerCode, selectedResultGraphIri) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP: {
      return <div>Filters for Google Maps not yet implemented.</div>;
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapFiltersComponent
          selectedResultGraphIri={selectedResultGraphIri}
        />
      );
    case VISUALIZER_TYPE.CHORD:
      return (
        <ChordFiltersComponent
          selectedResultGraphIri={selectedResultGraphIri}
        />
      );
    default:
      return <div>No filters available for selected visualizer.</div>;
  }
};

const getVisualizer = (
  visualizerCode,
  selectedResultGraphIri,
  selectedApplication,
  handleSetCurrentApplicationData,
  selectedApplicationMetadata,
  classes,
  selectedNodes,
  width,
  height
) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP: {
      const markers =
        selectedApplication && selectedApplication.markers
          ? selectedApplication.markers
          : [];
      return (
        <GoogleMapsVisualizer
          propMarkers={markers}
          isPublished={selectedApplicationMetadata !== undefined}
          selectedResultGraphIri={selectedResultGraphIri}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          isPublished={selectedApplicationMetadata !== undefined}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    case VISUALIZER_TYPE.CHORD:
      return (
        <ChordVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          isPublished={selectedApplicationMetadata !== undefined}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
          size={height + width}
          selectedNodes={selectedNodes}
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
    <Grid container className={props.classes.root} direction="row" spacing={40}>
      <Grid item lg={3} md={4} xs={12} className={props.classes.filterSideBar}>
        {getFilters(
          props.visualizer.visualizerCode,
          props.selectedResultGraphIri
        )}
      </Grid>
      <Grid
        id="viz-div"
        className={props.classes.vizdiv}
        item
        lg={9}
        md={8}
        xs={12}
      >
        {getVisualizer(
          props.visualizer.visualizerCode,
          props.selectedResultGraphIri,
          props.selectedApplication,
          props.handleSetCurrentApplicationData,
          props.selectedApplicationMetadata,
          props.classes,
          props.selectedNodes,
          props.width,
          props.height
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(VisualizerControllerContainer);
