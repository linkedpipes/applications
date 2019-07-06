// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

type Props = {
  classes: { textField: {}, gridRoot: {} },
  discoveryIsLoading: boolean,
  handleRdfInputIriTextFieldChange: () => void,
  rdfInputIri: string,
  handleSetRdfUrlDataSampleIri: Function,
  rdfUrlDataSampleIri: string
};

const styles = () => ({
  textField: {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1rem'
  }
});

const DiscoverSparqlSelectorFields = ({
  classes,
  discoveryIsLoading,
  handleRdfInputIriTextFieldChange,
  rdfInputIri,
  handleSetRdfUrlDataSampleIri,
  rdfUrlDataSampleIri
}: Props) => (
  <div>
    <TextField
      id="outlined-bare"
      label="Link to RDF resource"
      disabled={discoveryIsLoading}
      className={classes.textField}
      multiline
      autoFocus
      onChange={handleRdfInputIriTextFieldChange}
      placeholder="Input the link to your RDF resource..."
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true
      }}
      value={rdfInputIri}
    />

    <TextField
      id="outlined-bare"
      label="Data sample IRI (Optional)"
      disabled={discoveryIsLoading}
      className={classes.textField}
      multiline
      onChange={handleSetRdfUrlDataSampleIri}
      placeholder="Input your data sample IRI..."
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true
      }}
      value={rdfUrlDataSampleIri}
    />
  </div>
);

export default withStyles(styles)(DiscoverSparqlSelectorFields);
