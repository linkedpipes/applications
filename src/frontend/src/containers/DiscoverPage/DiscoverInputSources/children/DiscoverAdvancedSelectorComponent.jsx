// @flow
import React from 'react';
import { Grid, TextField } from '@material-ui/core';

type Props = {
  classes: { textField: {} },
  dataSampleIri: string,
  dataSampleTextFieldValue: string,
  discoveryIsLoading: boolean,
  handleDataSampleTextFieldChange: () => void,
  handleNamedGraphTextFieldChange: () => void,
  handleSparqlTextFieldChange: () => void,
  namedGraph: string,
  namedTextFieldValue: string,
  sparqlEndpointIri: string,
  sparqlTextFieldValue: string
};

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
}: Props) => (
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
        value={!sparqlEndpointIri ? sparqlTextFieldValue : sparqlEndpointIri}
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

export default DiscoverAdvancedSelectorComponent;
