// @flow
import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import { LinearLoader } from '@components';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { DiscoverSparqlSelectorFields, DiscoverRdfUrlField } from './children';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import './css/FilePondDarkStyle.css';

// Register the filepond plugins
registerPlugin(FilePondPluginFileValidateType);

type Props = {
  classes: any,
  dataSampleIri: string,
  dataSampleTextFieldValue: string,
  dataSourcesUris: string,
  discoveryIsLoading: boolean,
  discoveryLoadingLabel: string,
  namedGraph: string,
  namedTextFieldValue: string,
  onHandleProcessStartDiscovery: () => void,
  onHandleSetDataSampleIri: () => void,
  onHandleSetNamedGraph: () => void,
  onHandleSetSparqlIri: () => void,
  onHandleClearInputsClicked(): Function,
  sparqlEndpointIri: string,
  sparqlTextFieldValue: string,
  inputFieldsAreNotFilled: boolean,
  onHandleRdfInputIriTextFieldChange: Function,
  rdfInputIri: string,
  onHandleSetRdfFile: Function
};

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    flex: 1
  },
  gridRoot: {
    flexGrow: 1
  },
  itemGrid: {
    height: '100%',
    width: '100%',
    margin: 'auto'
  },
  card: {
    flexGrow: 1
  }
});

class DiscoverSelectorComponent extends PureComponent<Props> {
  pond: Object;

  render() {
    const {
      classes,
      discoveryIsLoading,
      discoveryLoadingLabel,
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      onHandleProcessStartDiscovery,
      onHandleClearInputsClicked,
      onHandleSetNamedGraph,
      onHandleSetDataSampleIri,
      onHandleSetSparqlIri,
      namedGraph,
      sparqlTextFieldValue,
      namedTextFieldValue,
      dataSampleTextFieldValue,
      inputFieldsAreNotFilled,
      onHandleRdfInputIriTextFieldChange,
      rdfInputIri,
      onHandleSetRdfFile
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.gridRoot}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={12}>
                <DiscoverSparqlSelectorFields
                  discoveryIsLoading={discoveryIsLoading}
                  handleSparqlTextFieldChange={onHandleSetSparqlIri}
                  handleDataSampleTextFieldChange={onHandleSetDataSampleIri}
                  handleNamedGraphTextFieldChange={onHandleSetNamedGraph}
                  sparqlEndpointIri={sparqlEndpointIri}
                  dataSampleIri={dataSampleIri}
                  namedGraph={namedGraph}
                  sparqlTextFieldValue={sparqlTextFieldValue}
                  namedTextFieldValue={namedTextFieldValue}
                  dataSampleTextFieldValue={dataSampleTextFieldValue}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Typography align="center" gutterBottom>
                  or
                </Typography>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={12}>
                <DiscoverRdfUrlField
                  discoveryIsLoading={discoveryIsLoading}
                  handleRdfInputIriTextFieldChange={
                    onHandleRdfInputIriTextFieldChange
                  }
                  rdfInputIri={rdfInputIri}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Typography align="center" gutterBottom>
                  or
                </Typography>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={12}>
                <FilePond
                  // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
                  ref={ref => (this.pond = ref)}
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

              <Grid item xs={12} sm={12}>
                {discoveryIsLoading ? (
                  <LinearLoader labelText={discoveryLoadingLabel} />
                ) : (
                  <Grid container spacing={16}>
                    <Grid item xs={6} sm={6}>
                      <Button
                        className={classes.itemGrid}
                        variant="contained"
                        component="span"
                        color="primary"
                        disabled={
                          dataSourcesUris &&
                          sparqlEndpointIri === '' &&
                          dataSampleIri === '' &&
                          namedGraph === ''
                        }
                        onClick={onHandleClearInputsClicked}
                        size="small"
                      >
                        Clear inputs
                      </Button>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                      <Button
                        className={classes.itemGrid}
                        variant="contained"
                        component="span"
                        color="secondary"
                        id="start-discovery-button"
                        disabled={inputFieldsAreNotFilled}
                        onClick={onHandleProcessStartDiscovery}
                        size="small"
                      >
                        Start Discovery
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(DiscoverSelectorComponent);
