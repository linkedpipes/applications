import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import connect from "react-redux/lib/connect/connect";
import MapIcon from "@material-ui/icons/Map";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { GoogleMapsPopup } from "../Visualizers";

const styles = theme => ({
  root: {
    justifyContent: "center",
    flex: 1
  },
  card: {},
  input: {}
});

class CreateAppCard extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card} style={{ textAlign: "center" }}>
        <CardActionArea>
          <MapIcon style={{ fontSize: "80px" }} />
          <CardContent>
            <Input
              placeholder="Maps Visualizer Title"
              className={classes.input}
              inputProps={{
                "aria-label": "Description"
              }}
            />
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.root }}>
          <GoogleMapsPopup />
        </CardActions>
      </Card>
    );
  }
}

CreateAppCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect()(withStyles(styles)(CreateAppCard));
