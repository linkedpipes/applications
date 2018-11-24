import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MapIcon from "@material-ui/icons/Map";

const styles = {
  root: {
    flexGrow: 1
  },
  textField: {
    flexGrow: 1
  }
};

class VisualizerControllerLabels extends React.Component {
  state = {
    title: "",
    subtitle: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentDidMount() {
    const self = this;
    const { title, subtitle } = self.props;
    self.setState({ title: title, subtitle: subtitle });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MapIcon style={{ fontSize: "70px" }} />
        <TextField
          classes={classes.textField}
          label="App title"
          className={classes.textField}
          value={this.state.title}
          placeholder="Enter your app Title"
          onChange={this.handleChange("title")}
          margin="normal"
        />
      </div>
    );
  }
}

VisualizerControllerLabels.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};

export default withStyles(styles)(VisualizerControllerLabels);
