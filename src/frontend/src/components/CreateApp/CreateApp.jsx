import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import GoogleMapsVisualizer from "../Visualizers";
import { VisualizerController } from "../VisualizerController";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

class CreateApp extends React.Component {
  render() {
    const { classes } = this.props;

    return <VisualizerController />;
  }
}

CreateApp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateApp);
