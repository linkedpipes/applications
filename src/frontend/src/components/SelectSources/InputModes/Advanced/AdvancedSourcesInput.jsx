import React, { Component, Fragment } from "react";
import { Grid, TextField } from "@material-ui/core";

export default class AdvancedSourcesInput extends Component {
  state = {
    sparqlTextFieldValue: "",
    dataSampleTextFieldValue: ""
  };

  render() {
    const {
      classes,
      discoveryIsLoading,
      sparqlTextFieldHandler,
      dataSampleTextFieldHandler
    } = this.props;

    const { sparqlTextFieldValue, dataSampleTextFieldValue } = this.state;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} sm={12}>
          <TextField
            id="outlined-textarea"
            label="SPARQL IRI"
            disabled={discoveryIsLoading}
            className={classes.textField}
            multiline
            onChange={sparqlTextFieldHandler}
            placeholder="Input your SPARQL IRI..."
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-textarea"
            label="Data sample IRI"
            disabled={discoveryIsLoading}
            className={classes.textField}
            multiline
            onChange={dataSampleTextFieldHandler}
            placeholder="Input your data sample IRI..."
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>
    );
  }
}
