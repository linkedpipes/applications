import * as PropTypes from 'prop-types';
import React from 'react';
import { Grid, TextField } from '@material-ui/core';

const DiscoverAdvancedSelectorComponent = ({
  classes,
  discoveryIsLoading,
  handleNamedGraphTextFieldChange,
  handleDataSampleTextFieldChange,
  handleSparqlTextFieldChange,
  sparqlEndpointIri,
  dataSampleIri,
  namedGraph,
  sparqlTextFieldValue,
  dataSampleTextFieldValue,
  namedTextFieldValue
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
        value={
          !sparqlEndpointIri ? sparqlTextFieldValue : sparqlEndpointIri
        }
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
        value={!dataSampleIri ? dataSampleTextFieldValue : dataSampleIri}
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
        value={!namedGraph ? namedTextFieldValue : namedGraph}
      />
    </Grid>
  </Grid>
);

DiscoverAdvancedSelectorComponent.propTypes = {
  classes: PropTypes.any,
  dataSampleIri: PropTypes.string,
  dataSampleTextFieldValue: PropTypes.string,
  discoveryIsLoading: PropTypes.any,
  handleDataSampleTextFieldChange: PropTypes.func,
  handleNamedGraphTextFieldChange: PropTypes.func,
  handleSparqlTextFieldChange: PropTypes.func,
  namedGraph: PropTypes.string,
  namedTextFieldValue: PropTypes.string,
  sparqlEndpointIri: PropTypes.string,
  sparqlTextFieldValue: PropTypes.string
};

export default DiscoverAdvancedSelectorComponent;
