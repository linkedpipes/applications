import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import connect from "react-redux/lib/connect/connect";
import { addSelectedVisualizerAction } from "../../_actions/globals";
import MapIcon from "@material-ui/icons/Map";

const styles = {
  root: {
    justifyContent: "center"
  },
  card: {
    maxHeight: 300,
    maxWidth: 345,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 10,
    marginRight: 8
  },
  media: {
    objectFit: "cover"
  }
};

class VisualizerCard extends React.Component {
  addSelectedVisualizer = visualizerData => {
    const self = this;

    return new Promise((resolve, reject) => {
      self.props.dispatch(
        addSelectedVisualizerAction({
          data: visualizerData
        })
      );
      resolve();
    });
  };

  handleSelectVisualizer = () => {
    const self = this;
    const visualizerData = self.props.visualizerData;

    self.addSelectedVisualizer(visualizerData).then(function() {
      self.props.handleNextStep();
    });
  };

  render() {
    const { classes, visualizerData } = this.props;

    return (
      <Card className={classes.card}>
        <CardActionArea style={{ textAlign: "center" }}>
          <MapIcon style={{ fontSize: "80px" }} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Test
            </Typography>
            <Typography component="p">
              {visualizerData.visualizer.label}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.root }}>
          <Button
            size="small"
            color="primary"
            onClick={this.handleSelectVisualizer}
          >
            Select Vizualizer
          </Button>
        </CardActions>
      </Card>
    );
  }
}

VisualizerCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect()(withStyles(styles)(VisualizerCard));
