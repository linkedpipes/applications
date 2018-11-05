import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Labels from "./VisualizerControllerLabels";
import Toolbox from "./VIsualizerControllerToolbox";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flex: 1,
    flexGrow: 1
  },
  card: {},
  input: {}
});

class VisualizerControllerHeader extends React.Component {
  render() {
    const { classes, headerParams } = this.props;

    return (
      <Paper className={classes.root}>
        <Grid
          container
          direction="row"
          className={classes.root}
          justify="space-between"
          alignItems="center"
        >
          <Labels title={headerParams.title} subtitle={headerParams.subtitle} />
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
