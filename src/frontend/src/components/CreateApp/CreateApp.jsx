import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { VisualizerController } from "../VisualizerController";
import { VISUALIZER_TYPE, optionModes, filterTypes } from "../../_constants";
import { DiscoveryService } from "../../_services";
import connect from "react-redux/lib/connect/connect";
import { addFilters } from "../../_actions/filters";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

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
  assembleFilters = properties => {
    return properties.map(property => {
      return {
        property: { uri: property.uri, label: property.label.variants.cs },
        type: filterTypes.CHECKBOX,
        enabled: true,
        expanded: true,
        options: [option1, option2],
        optionsUris: ["option1 URI", "option2 URI"]
      };
    });
  };

  componentDidMount() {
    const self = this;

    DiscoveryService.getFilters()
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          console.log(err);
        }
      )
      .then(function(jsonResponse) {
        self.props.dispatch(
          addFilters({
            filters: self.assembleFilters(jsonResponse)
          })
        );
      });
  }

  render() {
    const { classes } = this.props;

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

export default connect()(withStyles(styles)(CreateApp));
