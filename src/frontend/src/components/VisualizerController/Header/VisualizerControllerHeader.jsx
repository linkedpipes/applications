import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Labels from "./VisualizerControllerLabels";
import Toolbox from "./VisualizerControllerToolbox";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const styles = theme => ({
  root: {
    flex: 1,
    flexGrow: 1
  },
  header: {
    marginBottom: "1rem",
    // marginRight: "1rem",
    marginLeft: "1rem",
    marginTop: "1rem",
    right: "-1rem"
  }
});

class VisualizerControllerHeader extends React.Component {
  render() {
    const { classes, headerParams } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.header} position="static" color="default">
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
