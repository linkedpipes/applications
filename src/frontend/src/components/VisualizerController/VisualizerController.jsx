import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { VisualizerControllerHeader } from "./Header";
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
    const {
      classes,
      visualizerType,
      visualizerParams,
      filters,
      headerParams
    } = this.props;

    return (
      <div className={classes.root}>
        <VisualizerControllerHeader headerParams={headerParams} />
        <VisualizerContainer
          filters={filters}
          visualizerType={visualizerType}
          visualizerParams={visualizerParams}
        />
      </div>
    );
  }
}

VisualizerController.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerController);
