import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Labels from "./VisualizerControllerLabels";
import Toolbox from "./VIsualizerControllerToolbox";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

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
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Labels
              title={headerParams.title}
              subtitle={headerParams.subtitle}
            />
            <Toolbox />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

VisualizerControllerHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerHeader);
