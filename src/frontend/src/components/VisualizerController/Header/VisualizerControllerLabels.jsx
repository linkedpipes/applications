import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MapIcon from "@material-ui/icons/Map";

const styles = {
  root: {
    width: "100%",
    flexGrow: 1
  }
};

function VisualizerControllerLabels(props) {
  const { classes } = props;

  return (
    <Grid container direction="row" spacing={0} xs={8}>
      <Grid item>
        <MapIcon style={{ fontSize: "70px" }} />
      </Grid>
      <Grid container direction="column" xs={4}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Dataset overview
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" gutterBottom>
            Google Maps Visualizer
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

VisualizerControllerLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerLabels);
