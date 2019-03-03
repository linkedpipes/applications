import PropTypes from 'prop-types';
import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

const DiscoverSimpleSelectorComponent = ({
  classes,
  dataSourcesUris,
  discoveryIsLoading,
  textFieldValue,
  handleSelectedFile,
  handleValidateField
}) => (
  <Grid container spacing={16}>
    <Grid item xs={12} sm={12}>
      <TextField
        id="outlined-textarea"
        label="Sources validator"
        disabled={discoveryIsLoading}
        className={classes.textField}
        multiline
        value={
          !dataSourcesUris
            ? textFieldValue
            : dataSourcesUris
        }
        onChange={handleValidateField}
        placeholder="Input your sources..."
        fullWidth
        margin="normal"
        variant="outlined"
      />
    </Grid>

    <Grid item xs={12} sm={12}>
      <FilePond
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
          handleSelectedFile(fileItems);
        }}
      />
    </Grid>
  </Grid>
);

DiscoverSimpleSelectorComponent.propTypes = {
  classes: PropTypes.any,
  dataSourcesUris: PropTypes.any,
  discoveryIsLoading: PropTypes.any,
  handleSelectedFile: PropTypes.any,
  handleValidateField: PropTypes.any,
  textFieldValue: PropTypes.any
};

export default DiscoverSimpleSelectorComponent;
