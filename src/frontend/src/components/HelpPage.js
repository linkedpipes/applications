import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

function HelpPage(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography variant="display4" gutterBottom>
        FAQ
      </Typography>
      <Typography variant="display3" gutterBottom>
        To be implemented...
      </Typography>
    </div>
  );
}

HelpPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HelpPage);
