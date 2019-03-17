// @flow
import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import './styles';

type Props = {
  classes: { textField: {}, itemGrid: {} },
  dataSourcesUris: any,
  discoveryIsLoading: boolean,
  handleSelectedFile: any => void,
  handleValidateField: () => void,
  textFieldValue: string
};

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

const DiscoverSimpleSelectorComponent = ({
  classes,
  dataSourcesUris,
  discoveryIsLoading,
  textFieldValue,
  handleSelectedFile,
  handleValidateField
}: Props) => (
  <Grid container spacing={16}>
    <Grid item xs={12} sm={12}>
      <TextField
        id="outlined-textarea"
        label="Sources validator"
        disabled={discoveryIsLoading}
        className={classes.textField}
        multiline
        value={!dataSourcesUris ? textFieldValue : dataSourcesUris}
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

export default DiscoverSimpleSelectorComponent;
