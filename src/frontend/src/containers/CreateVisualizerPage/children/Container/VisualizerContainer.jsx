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

type Props = {
  classes: { root: {}, filterSideBar: {}, containerView: {} },
  filters: any,
  visualizer: { visualizerCode: string },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  selectedApplication: Object
};

const styles = theme => ({
  root: {
    flex: 1
  },
  containerView: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  },
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {}
});

const getFilters = (visualizerCode, selectedResultGraphIri) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
      return <div>Filters for Google Maps not yet implemented.</div>;
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapFiltersComponent
          selectedResultGraphIri={selectedResultGraphIri}
        />
      );
    case VISUALIZER_TYPE.CHORD:
      return <div>Filters for chord not yet implemented.</div>;
    default:
      return <div>No filters available for selected visualizer.</div>;
  }
};

const getVisualizer = (
  visualizerCode,
  selectedResultGraphIri,
  selectedApplication,
  handleSetCurrentApplicationData,
  classes
) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
      return (
        <GoogleMapsVisualizer
          propMarkers={[]}
          selectedResultGraphIri={selectedResultGraphIri}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
      const markers = selectedApplication.markers
        ? selectedApplication.markers
        : [];
      return (
        <GoogleMapsVisualizer
          propMarkers={markers}
          selectedResultGraphIri={selectedResultGraphIri}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        />
      );
    case VISUALIZER_TYPE.CHORD:
      return (
        <ChordVisualizer
          selectedResultGraphIri={selectedResultGraphIri}
          handleSetCurrentApplicationData={handleSetCurrentApplicationData}
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

const VisualizerControllerContainer = (props: Props) => (
  <Grid container className={props.classes.root} direction="row" spacing={0}>
    <Grid item lg={3} md={4} xs={12} className={props.classes.filterSideBar}>
      {getFilters(
        props.visualizer.visualizerCode,
        props.selectedResultGraphIri
      )}
    </Grid>
    <Grid id="viz-div" item lg={9} md={8} xs={12}>
      {getVisualizer(
        props.visualizer.visualizerCode,
        props.selectedResultGraphIri,
        props.selectedApplication,
        props.handleSetCurrentApplicationData,
        props.classes
      )}
    </Grid>
  </Grid>
);

export default withStyles(styles)(VisualizerControllerContainer);
