import React, { Component, Fragment } from "react";
import { Grid, TextField } from "@material-ui/core";
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

export default class SimpleSourcesInput extends Component {
  render() {
    const {
      classes,
      selectedDatasources,
      discoveryIsLoading,
      textFieldValue,
      handleSelectedFile
    } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} sm={12}>
          <TextField
            id="outlined-textarea"
            label="Sources validator"
            disabled={discoveryIsLoading}
            className={classes.textField}
            multiline
            value={
              selectedDatasources === undefined
                ? textFieldValue
                : selectedDatasources
            }
            onChange={this.props.validateField}
            placeholder="Input your sources..."
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <FilePond
            ref={ref => (this.pond = ref)}
            allowMultiple={false}
            allowFileTypeValidation={true}
            acceptedFileTypes={["text/turtle", ".ttl"]}
            fileValidateTypeLabelExpectedTypesMap={{
              "text/turtle": ".ttl"
            }}
            fileValidateTypeDetectType={(source, type) =>
              new Promise((resolve, reject) => {
                resolve(".ttl");
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
  }
}
