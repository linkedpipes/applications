import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import connect from "react-redux/lib/connect/connect";
import VisualizerCard from "./VisualizerCard";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
  },
  card: {
    minHeight: 40,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 10,
    marginRight: 8
  },
  label: {
    marginTop: 5,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto"
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
    const { classes, visualizers, discoveryId, handleNextStep } = this.props;
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
          {visualizers.length === 0 ? (
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography
                  className={classes.label}
                  variant="body2"
                  align="center"
                  gutterBottom
                >
                  No visualizers available, try providing different sources ☹️
                </Typography>
              </Card>
            </Grid>
          ) : (
            visualizers.map((value, index) => (
              <Grid key={index} item xs={4}>
                <VisualizerCard
                  visualizerData={value}
                  discoveryId={discoveryId}
                  handleNextStep={handleNextStep}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Grid>
    );
  }
}

VisualizerCardCollectionView.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    visualizers: state.visualizers,
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(VisualizerCardCollectionView)
);
