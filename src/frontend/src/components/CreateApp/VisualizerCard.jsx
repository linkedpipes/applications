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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import PipelinesTable from "./PipelinesTable";

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
    const { classes, visualizerData } = this.props;
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
              Test
            </Typography>
            <Typography component="p">
              {visualizerData.applicationInstance.label}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.root }}>
          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={pipelinesDialogOpen}
            onClose={this.handleClose}
          >
            <DialogTitle>
              <Typography variant="headline" gutterBottom>
                Pipelines Browser
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Each discovered pipeline presents a sequence of transformations
                that have to be applied to the data so that it can be visualized
                using this visualizer. Notice that different pipelines will give
                different outputs. You need to try them manually.
              </Typography>
              <p>
                <Typography variant="body2">
                  To create an application, first run a pipeline from the table
                  below.
                </Typography>
              </p>
              <PipelinesTable discoveryId={discoveryId} />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
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
