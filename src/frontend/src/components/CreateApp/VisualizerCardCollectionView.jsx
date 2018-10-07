import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import VisualizerCard from "./VisualizerCard";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

class VisualizerCardCollectionView extends React.Component {
  state = {
    spacing: "16"
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value
    });
  };

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid
          container
          className={classes.demo}
          justify="center"
          xs={12}
          spacing={Number(spacing)}
        >
          {[0, 1, 2].map(value => (
            <Grid key={value} item xs={4}>
              <VisualizerCard />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

VisualizerCardCollectionView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerCardCollectionView);
