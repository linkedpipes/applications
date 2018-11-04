import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { GoogleMapsVisualizer } from "../../Visualizers";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1,
    height: 500
  },
  card: {},
  input: {}
});

class VisualizerControllerContainer extends React.Component {
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
      <Grid container className={classes.root} spacing={0}>
        <Grid item xs={12}>
          <GoogleMapsVisualizer
            markers={dummyMarkers}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
      </Grid>
    );
  }
}

VisualizerControllerContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerContainer);
