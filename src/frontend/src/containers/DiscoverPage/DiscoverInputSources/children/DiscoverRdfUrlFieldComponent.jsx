// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

type Props = {
  classes: { textField: {}, gridRoot: {} },
  discoveryIsLoading: boolean,
  handleRdfInputIriTextFieldChange: () => void,
  rdfInputIri: string,
  handleDataSampleTextFieldChange: Function,
  dataSampleIri: string
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
  handleDataSampleTextFieldChange,
  dataSampleIri
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
      label="Data sample IRI"
      disabled={discoveryIsLoading}
      className={classes.textField}
      multiline
      onChange={handleDataSampleTextFieldChange}
      placeholder="Input your data sample IRI..."
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true
      }}
      value={dataSampleIri}
    />
  </div>
);

const mapStateToProps = state => {
  return {
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    namedGraph: state.discover.namedGraph
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(DiscoverSparqlSelectorFields)
);
