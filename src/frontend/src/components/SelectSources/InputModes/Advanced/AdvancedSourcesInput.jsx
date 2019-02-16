import React, { Component, Fragment } from "react";
import { Grid, TextField } from "@material-ui/core";

export default class AdvancedSourcesInput extends Component {
  render() {
    const {
      classes,
      selectedDatasources,
      discoveryIsLoading,
      textFieldValue
    } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} sm={12}>
          <TextField
            id="outlined-textarea"
            label="SPARQL IRI"
            disabled={discoveryIsLoading}
            className={classes.textField}
            multiline
            value={
              selectedDatasources === undefined
                ? textFieldValue
                : selectedDatasources
            }
            onChange={this.props.validateField}
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
            value={
              selectedDatasources === undefined
                ? textFieldValue
                : selectedDatasources
            }
            onChange={this.props.validateField}
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
