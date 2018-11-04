import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Labels from "./Header/VisualizerControllerLabels";
import { VisualizerControllerHeader } from "./Header";
import Grid from "@material-ui/core/Grid";
import { VisualizerContainer } from "./Container";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

class VisualizerController extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <VisualizerControllerHeader />
        <VisualizerContainer />
      </div>
    );
  }
}

VisualizerController.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerController);
