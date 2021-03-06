// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

type Props = {
  classes: { textField: {}, gridRoot: {} },
  dataSampleIri: string,
  discoveryIsLoading: boolean,
  handleDataSampleTextFieldChange: () => void,
  handleNamedGraphTextFieldChange: () => void,
  handleSparqlTextFieldChange: () => void,
  namedGraph: string,
  sparqlEndpointIri: string
};

const styles = () => ({
  textField: {
    width: '100%',
    marginTop: '1rem'
  }
});

const DiscoverSparqlSelectorFields = ({
  classes,
  discoveryIsLoading,
  handleNamedGraphTextFieldChange,
  handleDataSampleTextFieldChange,
  handleSparqlTextFieldChange,
  sparqlEndpointIri,
  dataSampleIri,
  namedGraph
}: Props) => (
  <div>
    <TextField
      id="outlined-bare"
      label="SPARQL IRI"
      disabled={discoveryIsLoading}
      className={classes.textField}
      multiline
      autoFocus
      onChange={handleSparqlTextFieldChange}
      placeholder="Input your SPARQL IRI..."
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true
      }}
      value={sparqlEndpointIri}
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

    <TextField
      id="outlined-bare"
      label="Named Graph IRI"
      disabled={discoveryIsLoading}
      className={classes.textField}
      multiline
      onChange={handleNamedGraphTextFieldChange}
      placeholder="Input your named graph IRI..."
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true
      }}
      value={namedGraph}
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
