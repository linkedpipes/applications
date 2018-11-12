import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { VisualizerControllerHeader } from "./Header";
import { VisualizerContainer } from "./Container";
import connect from "react-redux/lib/connect/connect";

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

const mapStateToProps = state => {
  return {
    filters: state.filters
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(VisualizerController)
);
