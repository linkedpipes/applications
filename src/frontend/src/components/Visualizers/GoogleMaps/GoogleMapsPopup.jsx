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

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class GoogleMapsPopup extends React.Component {
  state = {
    open: false,
    markers: []
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

    DiscoveryService.getMarkers(null, null)
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          console.log(err);
        }
      )
      .then(function(jsonResponse) {
        self.setState({ markers: jsonResponse });
      });
  }

  render() {
    const { classes } = this.props;
    const { markers } = this.state;
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
                GoogleMaps App Preview
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Create App
              </Button>
            </Toolbar>
          </AppBar>

          <GoogleMapsVisualizer
            markers={markers}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Dialog>
      </span>
    );
  }
}

GoogleMapsPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  popupAction: PropTypes.object
};

export default withRouter(withStyles(styles)(GoogleMapsPopup));
