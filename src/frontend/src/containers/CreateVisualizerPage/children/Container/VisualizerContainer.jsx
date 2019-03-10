// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { GoogleMapsVisualizer, TreemapVisualizer } from '@components';
import { VISUALIZER_TYPE } from '@constants';
import FiltersComponent from '../Filters';

type Props = {
  classes: { root: {}, filterSideBar: {} },
  filters: any,
  visualizer: { visualizerCode: string },
  visualizerParams: any,
  selectedResultGraphIri: string
};

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

const getVisualizer = (
  visualizerCode,
  selectedResultGraphIri,
  visualizerParams = null
) => {
  switch (visualizerCode) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
      const markers = [];
      return (
        <GoogleMapsVisualizer
          markers={markers}
          selectedResultGraphIri={selectedResultGraphIri}
        />
      );
    }
    case VISUALIZER_TYPE.TREEMAP:
      return (
        <TreemapVisualizer selectedResultGraphIri={selectedResultGraphIri} />
      );
    default:
      return <div>No valid visualizer selected.</div>;
  }
};

const VisualizerControllerContainer = (props: Props) => (
  <Grid container className={props.classes.root} direction="row" spacing={0}>
    <Grid item lg={3} md={4} xs={12} className={props.classes.filterSideBar}>
      <FiltersComponent filters={props.filters} />
    </Grid>
    <Grid item lg={9} md={8} xs={12}>
      {getVisualizer(
        props.visualizer.visualizerCode,
        props.selectedResultGraphIri,
        props.visualizerParams
      )}
    </Grid>
  </Grid>
);

export default withStyles(styles)(VisualizerControllerContainer);
