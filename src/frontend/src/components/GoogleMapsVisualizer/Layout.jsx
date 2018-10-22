import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';
import MyMapComponent from './GoogleMapsVisualizer';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    this.markers = [{uri: "uri1", coordinates: { lat: -34.300, lng: 149.644 }, title: "marker title1" },
        {uri: "uri2", coordinates: { lat: -34.300, lng: 152.644 }, title: "marker title2" },
        {uri: "uri3", coordinates: { lat: -35.300, lng: 149.644 }, title: "marker title3" }];
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Show map</Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Output preview
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Continue
              </Button>
            </Toolbar>
          </AppBar>

          <MyMapComponent
            markers={this.markers}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullScreenDialog);
