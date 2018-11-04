import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PreviewIcon from "@material-ui/icons/Wallpaper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

function VisualizerControllerToolbox(props) {
  const { classes } = props;

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      xs={4}
      alignItems="center"
      justify="center"
    >
      <Grid item>
        <Button variant="contained" color="default" size="small">
          <PreviewIcon className={classes.leftIcon} />
          Preview
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="default" size="small">
          <CloudUploadIcon className={classes.leftIcon} />
          Publish
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="default" size="small">
          <KeyboardArrowDownIcon className={classes.leftIcon} />
          More
        </Button>
      </Grid>
    </Grid>
  );
}

VisualizerControllerToolbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerToolbox);
