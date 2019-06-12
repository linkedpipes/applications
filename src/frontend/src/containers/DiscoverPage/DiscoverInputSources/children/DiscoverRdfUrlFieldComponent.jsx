// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

type Props = {
  classes: { textField: {}, gridRoot: {} },
  discoveryIsLoading: boolean,
  handleRdfInputIriTextFieldChange: () => void,
  rdfInputIri: string
};

const styles = () => ({
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    margin: 'auto',
    width: '100%'
  }
});

const DiscoverSparqlSelectorFields = ({
  classes,
  discoveryIsLoading,
  handleRdfInputIriTextFieldChange,
  rdfInputIri
}: Props) => (
  <div className={classes.gridRoot}>
    <Grid container spacing={10}>
      <Grid item xs={12} sm={12}>
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
      </Grid>
    </Grid>
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
