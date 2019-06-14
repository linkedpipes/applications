// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import './css/FilePondDarkStyle.css';

// Register the filepond plugins
registerPlugin(FilePondPluginFileValidateType);

type Props = {
  classes: { textField: {}, gridRoot: {}, itemGrid: {} },
  discoveryIsLoading: boolean,
  dataSampleIri: string,
  handleDataSampleTextFieldChange: Function,
  onHandleSetRdfFile: Function
};

const styles = () => ({
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    margin: 'auto',
    width: '100%',
    marginTop: '0.5rem'
  },
  itemGrid: {
    height: '100%',
    width: '100%',
    margin: 'auto'
  }
});

const DiscoverRdfFileDropInComponent = ({
  classes,
  discoveryIsLoading,
  onHandleSetRdfFile,
  handleDataSampleTextFieldChange,
  dataSampleIri
}: Props) => (
  <div className={classes.gridRoot}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
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
      </Grid>
      <Grid item xs={12} sm={12}>
        <FilePond
          // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
          allowMultiple={false}
          allowFileTypeValidation
          acceptedFileTypes={['text/turtle', '.ttl']}
          fileValidateTypeLabelExpectedTypesMap={{
            'text/turtle': '.ttl'
          }}
          fileValidateTypeDetectType={() =>
            new Promise(resolve => {
              resolve('.ttl');
            })
          }
          className={classes.itemGrid}
          maxFiles={3}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            onHandleSetRdfFile(
              fileItems.length === 1 ? fileItems[0].file : undefined
            );
          }}
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
  withStyles(styles)(DiscoverRdfFileDropInComponent)
);