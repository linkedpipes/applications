import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Visualizer Logo"
            className={classes.media}
            height="100"
            image="/static/images/cards/contemplative-reptile.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              Google Maps
            </Typography>
            <Typography component="p">Google Maps Visualizer</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.root }}>
          <Button size="small" color="primary">
            Browse Pipelines
          </Button>
        </CardActions>
      </Card>
    );
  }
}

VisualizerCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VisualizerCard);
