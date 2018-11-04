import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Labels from "./VisualizerControllerLabels";
import Toolbox from "./VIsualizerControllerToolbox";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

class VisualizerControllerHeader extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Grid
          container
          direction="row"
          className={classes.root}
          alignContent={"center"}
          spacing={0}
        >
          <Labels />
          <Toolbox />
        </Grid>
      </Paper>
    );
  }
}

VisualizerControllerHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerHeader);
