import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import React from "react";
import GoogleMapsVisualizer from "./GoogleMapsVisualizer";
import { DiscoveryService } from "../../../_services";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Filters from "../../VisualizerController/Filters/Filters";
import { addFilters } from "../../../_actions/filters";
import { addMultipleMarkers } from "../../../_actions/markers";
import { optionModes, filterTypes } from "../../../_constants";
import connect from "react-redux/lib/connect/connect";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  grid: {
    height: "100vh"
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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

class GoogleMapsPopup extends React.Component {
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

  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const self = this;

    self.setState(
      {
        open: true
      },
      () => {
        self.handleCreateAppPressed();
      }
    );
  };

  handleCreateAppPressed = () => {
    this.props.history.replace("/create-app");
  };

  componentDidMount() {
    const self = this;
    const { resultGraphIri } = self.props;

    DiscoveryService.getMarkers({ resultGraphIri: resultGraphIri })
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          console.log(err);
        }
      )
      .then(function(jsonResponse) {
        self.props.dispatch(addMultipleMarkers({ markersList: jsonResponse }));
      });

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
        self.props.dispatch(addFilters(self.assembleFilters(jsonResponse)));
      });
  }

  render() {
    const { classes, markers, filters } = this.props;
    return (
      <span>
        <Button className={classes.button} onClick={this.handleClickOpen}>
          Preview
        </Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Google Maps App Preview
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Create App
              </Button>
            </Toolbar>
          </AppBar>

          <Grid container direction="row" className={classes.grid}>
            <Grid item md={3}>
              <Filters filters={filters} />
            </Grid>
            <Grid item md={9}>
              <GoogleMapsVisualizer
                markers={markers}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Grid>
          </Grid>
        </Dialog>
      </span>
    );
  }
}

GoogleMapsPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  popupAction: PropTypes.object
};

const mapStateToProps = state => {
  return {
    markers: state.markers,
    filters: state.filters
  };
};

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(GoogleMapsPopup))
);
