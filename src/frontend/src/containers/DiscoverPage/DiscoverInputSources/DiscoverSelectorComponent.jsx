// @flow
import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import { LinearLoader } from '@components';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {
  DiscoverSparqlSelectorFields,
  DiscoverRdfUrlField,
  DiscoverRdfFileDropIn
} from './children';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
  onHandleSetRdfFile: Function,
  onHandleTabIndexChange: Function,
  tabIndex: Number
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
      onHandleSetRdfFile,
      tabIndex,
      onHandleTabIndexChange
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.gridRoot}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={12}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={tabIndex}
                    onChange={onHandleTabIndexChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab label="From SPARQL endpoint" />
                    <Tab label="From URL with RDF" />
                    <Tab label="From File with RDF" />
                  </Tabs>
                </AppBar>
              </Grid>

              <Grid item xs={12} sm={12}>
                <SwipeableViews axis={'x'} index={tabIndex}>
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

                  <DiscoverRdfUrlField
                    discoveryIsLoading={discoveryIsLoading}
                    handleRdfInputIriTextFieldChange={
                      onHandleRdfInputIriTextFieldChange
                    }
                    rdfInputIri={rdfInputIri}
                    handleDataSampleTextFieldChange={onHandleSetDataSampleIri}
                    dataSampleIri={dataSampleIri}
                  />
                  <DiscoverRdfFileDropIn
                    pond={this.pond}
                    discoveryIsLoading={discoveryIsLoading}
                    onHandleSetRdfFile={onHandleSetRdfFile}
                    handleDataSampleTextFieldChange={onHandleSetDataSampleIri}
                    dataSampleIri={dataSampleIri}
                  />
                </SwipeableViews>
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
