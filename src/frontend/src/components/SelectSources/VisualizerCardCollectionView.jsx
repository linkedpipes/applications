import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import connect from "react-redux/lib/connect/connect";
import VisualizerCard from "./VisualizerCard";
import classNames from "classnames";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
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
    const {
      classes,
      visualizers,
      discoveryId,
      handleNextStep,
      hasOneVisualizer
    } = this.props;
    const { spacing } = this.state;

    return (
      <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container className={classes.root} spacing={40}>
          <Grid
            container
            className={classes.demo}
            justify="center"
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
                <Grid key={index} item sm={6} md={4} lg={3}>
                  <VisualizerCard
                    visualizerData={value}
                    discoveryId={discoveryId}
                    handleNextStep={handleNextStep}
                    hasOneVisualizer={hasOneVisualizer}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

VisualizerCardCollectionView.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    visualizers: state.visualizers,
    hasOneVisualizer: state.visualizers.length === 1,
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(VisualizerCardCollectionView)
);
