import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";
import AppBar from "./AppBar";

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

class Index extends React.Component {
  state = {
    open: false
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleClick = () => {
    this.setState({
      open: true
    });
  };

  makeRequest = () => {
    fetch("http://localhost:8080/datasources")
      .then(response => response.json())
      .then(responseData => console.log(responseData))
      .catch("motherfuckeeeeeeer");
  };

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      console.log(response.data);
    });
  };

  onChange = e => {
    console.log("got file");
    this.setState({ file: e.target.files[0] });
  };

  fileUpload = file => {
    const url = "http://example.com/file-upload";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    console.log("Something something");
    return post(url, formData, config);
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <header>
        <AppBar />
        <div className={classes.root}>
          <Typography variant="display1" gutterBottom>
            Select TTL config file
          </Typography>
          <form onSubmit={this.onFormSubmit}>
            <input
              accept=".ttl"
              className={classes.input}
              onChange={this.onChange}
              id="contained-button-file"
              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                className={classes.button}
              >
                Upload
              </Button>
            </label>
          </form>
        </div>
      </header>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Index));
