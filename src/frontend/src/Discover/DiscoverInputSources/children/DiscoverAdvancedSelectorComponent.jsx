import * as PropTypes from 'prop-types';
import React from 'react';
import { Grid, TextField } from '@material-ui/core';

const DiscoverAdvancedSelectorComponent = ({
  classes,
  discoveryIsLoading,
  handleNamedGraphTextFieldChange,
  handleDataSampleTextFieldChange,
  handleSparqlTextFieldChange
}) => (
  <Grid container spacing={16}>
    <Grid item xs={12} sm={12}>
      <TextField
        id="outlined-textarea"
        label="SPARQL IRI"
        disabled={discoveryIsLoading}
        className={classes.textField}
        multiline
        onChange={handleSparqlTextFieldChange}
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
        onChange={handleDataSampleTextFieldChange}
        placeholder="Input your data sample IRI..."
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        id="outlined-textarea"
        label="Named Graph IRI"
        disabled={discoveryIsLoading}
        className={classes.textField}
        multiline
        onChange={handleNamedGraphTextFieldChange}
        placeholder="Input your named graph IRI..."
        fullWidth
        margin="normal"
        variant="outlined"
      />
    </Grid>
  </Grid>
);

DiscoverAdvancedSelectorComponent.propTypes = {
  classes: PropTypes.any,
  discoveryIsLoading: PropTypes.any,
  handleDataSampleTextFieldChange: PropTypes.any,
  handleNamedGraphTextFieldChange: PropTypes.any,
  handleSparqlTextFieldChange: PropTypes.any
};

export default DiscoverAdvancedSelectorComponent;
