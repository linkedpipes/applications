import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import GoogleMapsVisualizer from "../Visualizers";
import { VisualizerController } from "../VisualizerController";
import { VISUALIZER_TYPE } from "../../_constants";

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

    const dummyMarkers = [
      {
        uri:
          "http://linked.opendata.cz/resource/domain/cenia.cz/provozovny/CZ0065863E",
        coordinates: {
          lat: 49.243547222222226,
          lng: 13.516010555555555
        },
        label: "Transformovna Sušice",
        description: null
      },
      {
        uri:
          "http://linked.opendata.cz/resource/domain/coi.cz/check-action/101202279553001/postal-address",
        coordinates: {
          lat: 49.65865489999999,
          lng: 17.0811406
        },
        label: null,
        description: null
      }
    ];

    return (
      <VisualizerController
        visualizerType={VISUALIZER_TYPE.GoogleMaps}
        visualizerParams={{ markers: dummyMarkers }}
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

export default withStyles(styles)(CreateApp);
