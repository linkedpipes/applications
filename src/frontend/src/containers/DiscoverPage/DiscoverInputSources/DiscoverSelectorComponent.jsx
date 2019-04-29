// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import { LinearLoader } from '@components';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DiscoverSelectorFields from './children';

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
  ttlFile: any
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
  textField: {
    margin: 'auto',
    width: '100%'
  },
  card: {
    flexGrow: 1
  }
});

const DiscoverSelectorComponent = ({
  classes,
  discoveryIsLoading,
  discoveryLoadingLabel,
  dataSourcesUris,
  ttlFile,
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
  dataSampleTextFieldValue
}: Props) => (
  <Card className={classes.card}>
    <CardContent>
      <div className={classes.gridRoot}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12}>
            <DiscoverSelectorFields
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
                      !ttlFile &&
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
                    disabled={
                      !ttlFile &&
                      !dataSourcesUris &&
                      sparqlEndpointIri === '' &&
                      dataSampleIri === '' &&
                      namedGraph === ''
                    }
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

export default withStyles(styles)(DiscoverSelectorComponent);
