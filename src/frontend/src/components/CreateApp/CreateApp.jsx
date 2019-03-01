import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { VisualizerController } from "../VisualizerController";
import { VISUALIZER_TYPE, optionModes, filterTypes } from "../../_constants";
import connect from "react-redux/lib/connect/connect";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

const skoConcept1 = {
  label: "skoConcept1label",
  uri: "skoConcept1URI",
  schemeUri: "skoConcept1URI",
  linkUris: []
};

const skoConcept2 = {
  label: "skoConcept2 label",
  uri: "skoConcept2URI",
  schemeUri: "skoConcept2URI",
  linkUris: []
};
const option1 = {
  skosConcept: skoConcept1,
  count: null,
  mode: optionModes.USER_DEFINED,
  selected: true
};

const option2 = {
  skosConcept: skoConcept2,
  count: null,
  mode: optionModes.USER_DEFINED,
  selected: false
};

class CreateApp extends React.Component {
  render() {
    const { classes, markers } = this.props;

    return (
      <VisualizerController
        visualizerType={this.props.visualizer.iri}
        visualizerParams={{ markers: markers }}
        headerParams={{
          title: "Dataset overview",
          subtitle: "Google Maps Visualizer"
        }}
      />
    );
  }
}

CreateApp.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    markers: state.markers,
    filters: state.filters,
    visualizer: state.globals.selectedVisualizer.visualizer
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CreateApp));
