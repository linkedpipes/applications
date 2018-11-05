import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import Link from "react-router-dom/es/Link";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: "2rem",
    marginLeft: "10%",
    marginRight: "10%"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing.unit,
    width: "90%"
  },
  createBtn: {
    margin: theme.spacing.unit,
    width: "90%",
    backgroundColor: "#00695C",
    color: "white",
    textDecoration: "none"
  },
  templatesBtn: {
    margin: theme.spacing.unit,
    width: "90%",
    backgroundColor: "#154168",
    color: "white"
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1" gutterBottom>
                Start by creating a new application
              </Typography>
              <Link to={"/select-sources"}>
                <Button
                  variant="contained"
                  size="large"
                  className={classes.createBtn}
                >
                  Create
                </Button>
              </Link>
              <br />
              <Button
                variant="contained"
                size="large"
                className={classes.templatesBtn}
              >
                Templates
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1" gutterBottom>
                Recent applications
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1" gutterBottom>
                Running discoveries
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styledDashboard = withStyles(styles)(Dashboard);
export { styledDashboard as Dashboard };

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
