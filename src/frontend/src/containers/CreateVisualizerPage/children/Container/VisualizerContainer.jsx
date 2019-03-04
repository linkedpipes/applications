import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { GoogleMapsVisualizer, TreemapVisualizer } from '@components';
import { VISUALIZER_TYPE } from '@constants';
import FiltersComponent from '../Filters';

const styles = () => ({
  root: {
    height: '100vh'
  },
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {}
});

const getVisualizer = visualizerCode => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
      const markers = [];
      return <GoogleMapsVisualizer markers={markers} />;
    }
    case VISUALIZER_TYPE.TREEMAP:
      return <TreemapVisualizer />;
    default:
      return <div>No valid visualizer selected.</div>;
  }
};

const VisualizerControllerContainer = ({
  classes,
  visualizer,
  visualizerParams,
  filters
}) => (
  <Grid container className={classes.root} direction="row" spacing={0}>
    <Grid item lg={3} md={4} xs={12} className={classes.filterSideBar}>
      <FiltersComponent filters={filters} />
    </Grid>
    <Grid item lg={9} md={8} xs={12}>
      {getVisualizer(visualizer.visualizerCode, visualizerParams)}
    </Grid>
  </Grid>
);

VisualizerControllerContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  filters: PropTypes.any,
  visualizer: PropTypes.object.isRequired,
  visualizerParams: PropTypes.any
};

export default withStyles(styles)(VisualizerControllerContainer);
