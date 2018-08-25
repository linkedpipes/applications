import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SelectSources from "./SelectSources";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 300,
    width: 500
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

class GuttersGrid extends React.Component {
  state = {
    spacing: "16"
  };

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <body>
        <div style={{ padding: 50 }}>
          <Grid
            container
            items
            xs={"auto"}
            container
            spacing={200}
            direction="row"
            justify="center"
          >
            <SelectSources className={classes.paper} />
          </Grid>
        </div>
      </body>
    );
  }
}

GuttersGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GuttersGrid);
