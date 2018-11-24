import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PreviewIcon from "@material-ui/icons/Wallpaper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

class VisualizerControllerToolbox extends React.Component {
  state = {
    checkedRefresh: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="contained" color="default" className={classes.button}>
          <CloudUploadIcon className={classes.leftIcon} />
          Publish
        </Button>
        <Button variant="contained" color="default" className={classes.button}>
          <PreviewIcon className={classes.leftIcon} />
          Embed
        </Button>
        <Button variant="contained" color="default" className={classes.button}>
          <KeyboardArrowDownIcon className={classes.leftIcon} />
          More
        </Button>
      </div>
    );
  }
}

VisualizerControllerToolbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerToolbox);
