import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PreviewIcon from "@material-ui/icons/Wallpaper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = theme => ({
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
      <Grid
        container
        item
        direction="row"
        spacing={0}
        alignContent="flex-end"
        xs={3}
      >
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedRefresh}
                onChange={this.handleChange("checkedRefresh")}
                value="checkedRefresh"
              />
            }
            label={this.state.checkedRefresh ? "Refresh" : "Fixed"}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="default" size="small">
            <CloudUploadIcon className={classes.leftIcon} />
            Publish
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="default" size="small">
            <PreviewIcon className={classes.leftIcon} />
            Embed
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
}

VisualizerControllerToolbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerControllerToolbox);
