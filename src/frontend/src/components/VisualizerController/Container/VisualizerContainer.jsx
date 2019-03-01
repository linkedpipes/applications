import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { GoogleMapsVisualizer, TreemapVisualizer } from "../../Visualizers";
import { VISUALIZER_TYPE } from "../../../_constants";
import Filters from "../Filters/Filters";

const styles = theme => ({
  root: {
    height: "100vh"
  },
  filterSideBar: {
    overflowY: "auto"
  },
  card: {},
  input: {}
});

class VisualizerControllerContainer extends React.Component {
  getVisualizer = (type, params) => {
    switch (type) {
      case VISUALIZER_TYPE.GoogleMaps:
        const markers = params.markers;
        return <GoogleMapsVisualizer markers={markers} />;
      case VISUALIZER_TYPE.Treemap:
        return <TreemapVisualizer />;
      default:
        return <div />;
    }
  };

  render() {
    const { classes, visualizerType, visualizerParams, filters } = this.props;

    return (
      <Grid container className={classes.root} direction="row" spacing={0}>
        <Grid item lg={3} md={4} xs={12} className={classes.filterSideBar}>
          <Filters filters={filters} />
        </Grid>
        <Grid item lg={9} md={8} xs={12}>
          {this.getVisualizer(visualizerType, visualizerParams)}
        </Grid>
      </Grid>
    );
  }
}

VisualizerControllerContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerContainer);
