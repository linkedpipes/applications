// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
type Props = {
  classes: { textField: {} },
  dataSampleIri: string,
  discoveryIsLoading: boolean,
  handleDataSampleTextFieldChange: () => void,
  handleNamedGraphTextFieldChange: () => void,
  handleSparqlTextFieldChange: () => void,
  namedGraph: string,
  sparqlEndpointIri: string
};

const DiscoverSelectorComponent = ({
  classes,
  discoveryIsLoading,
  handleNamedGraphTextFieldChange,
  handleDataSampleTextFieldChange,
  handleSparqlTextFieldChange,
  sparqlEndpointIri,
  dataSampleIri,
  namedGraph
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
        value={sparqlEndpointIri}
      />
    </Grid>

    <Grid item xs={12} sm={12}>
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
        value={dataSampleIri}
      />
    </Grid>

    <Grid item xs={12} sm={12}>
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
        value={namedGraph}
      />
    </Grid>
  </Grid>
);

export default DiscoverSelectorComponent;
