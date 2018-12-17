import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import { toast } from "react-toastify";
const FileClient = require("solid-file-client");

const styles = theme => ({
  root: {
    justifyContent: "center"
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardContent: {
    flexGrow: 1
  },
  media: {
    objectFit: "cover"
  },
  uploadButton: {
    marginTop: theme.spacing.unit * 3
  }
});

class UploadFilePopup extends React.Component {
  state = {
    textFieldValue: ""
  };

  loadData = url => {
    return fetch(url).then(function(response) {
      // console.log(url + " -> " + response.ok);
      if (response.ok) {
        return response.text();
      }
      throw new Error("Error message.");
    });
  };

  handleUploadFile = e => {
    e.preventDefault();
    const self = this;

    self.loadData(this.state.textFieldValue).then(function(ttlFile) {
      FileClient.createFile(
        "https://aorumbayev.solid.community/public/testtt/test.ttl"
      ).then(
        success => {
          console.log(`Created file.`);
          FileClient.updateFile(
            "https://aorumbayev.solid.community/public/testtt/test.ttl",
            JSON.stringify(ttlFile),
            "text/plain"
          ).then(
            success => {
              console.log(`Updated file!`);
              toast.success(
                "Uploaded file .ttl file into Comminuty POD ! :-)",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000
                }
              );
            },
            err => console.log(err)
          );
        },
        err => console.log(err)
      );
    });

    // FileClient.createFolder(
    //   "https://aorumbayev.solid.community/public/testtt"
    // ).then(
    //   success => {
    //     console.log(`Created folder ${url}.`);
    //   },
    //   err => console.log(err)
    // );
  };

  handleTextFieldChange = e => {
    let rawText = e.target.value;
    this.setState({ textFieldValue: rawText });
  };

  render() {
    const { classes } = this.props;
    const { textFieldValue } = this.state;
    const self = this;

    return (
      <Card className={classes.card}>
        <CardActionArea style={{ textAlign: "center" }}>
          <CardContent className={classes.CardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              LPApps File Uploader
            </Typography>
            <Typography component="p">
              Upload your applications to SOLID with ease!
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.root }}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="outlined-textarea"
                label="File uploader"
                className={classes.textField}
                multiline
                value={textFieldValue}
                onChange={this.handleTextFieldChange}
                placeholder="Provide a link to .ttl file"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={e => {
                self.handleUploadFile(e);
              }}
              className={classes.uploadButton}
            >
              Upload File
            </Button>

            <Grid item xs={12} sm={12} />
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

UploadFilePopup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadFilePopup);
