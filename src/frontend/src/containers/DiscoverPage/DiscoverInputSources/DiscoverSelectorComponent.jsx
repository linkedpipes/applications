// @flow
import React, { PureComponent } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
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
import { LinearLoader } from '@components';

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
  onHandleSetRdfUrlDataSampleIri: () => void,
  onHandleSetNamedGraph: () => void,
  onHandleSetSparqlIri: () => void,
  onHandleClearInputsClicked(): Function,
  sparqlEndpointIri: string,
  sparqlTextFieldValue: string,
  inputFieldsAreNotFilled: boolean,
  onHandleRdfInputIriTextFieldChange: Function,
  rdfInputIri: string,
  onHandleSetRdfFile: Function,
  onHandleSetRdfDataSampleFile: Function,
  onHandleTabIndexChange: Function,
  tabIndex: Number,
  rdfUrlDataSampleIri: string
};

const styles = () => ({
  gridRoot: {
    flexGrow: 1
  },
  itemGrid: {
    height: '100%',
    width: '100%'
  },
  card: {
    flexGrow: 1
  },
  appBar: {
    marginBottom: '1rem'
  }
});

class DiscoverSelectorComponent extends PureComponent<Props> {
  render() {
    const {
      classes,
      discoveryIsLoading,
      discoveryLoadingLabel,
      dataSourcesUris,
      sparqlEndpointIri,
      dataSampleIri,
      rdfUrlDataSampleIri,
      onHandleProcessStartDiscovery,
      onHandleClearInputsClicked,
      onHandleSetNamedGraph,
      onHandleSetDataSampleIri,
      onHandleSetRdfUrlDataSampleIri,
      onHandleSetSparqlIri,
      namedGraph,
      sparqlTextFieldValue,
      namedTextFieldValue,
      dataSampleTextFieldValue,
      inputFieldsAreNotFilled,
      onHandleRdfInputIriTextFieldChange,
      rdfInputIri,
      onHandleSetRdfFile,
      onHandleSetRdfDataSampleFile,
      tabIndex,
      onHandleTabIndexChange
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.gridRoot}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <AppBar
                  className={classes.appBar}
                  position="static"
                  color="default"
                >
                  <Tabs
                    value={tabIndex}
                    onChange={onHandleTabIndexChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab
                      label="From SPARQL endpoint"
                      disabled={discoveryIsLoading}
                    />
                    <Tab
                      label="From URL with RDF"
                      disabled={discoveryIsLoading}
                    />
                    <Tab
                      label="From File with RDF"
                      disabled={discoveryIsLoading}
                    />
                  </Tabs>
                </AppBar>
                <SwipeableViews index={tabIndex}>
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
                    handleSetRdfUrlDataSampleIri={
                      onHandleSetRdfUrlDataSampleIri
                    }
                    rdfUrlDataSampleIri={rdfUrlDataSampleIri}
                  />
                  <DiscoverRdfFileDropIn
                    discoveryIsLoading={discoveryIsLoading}
                    onHandleSetRdfFile={onHandleSetRdfFile}
                    onHandleSetRdfDataSampleFile={onHandleSetRdfDataSampleFile}
                    handleDataSampleTextFieldChange={onHandleSetDataSampleIri}
                    dataSampleIri={dataSampleIri}
                  />
                </SwipeableViews>
              </Grid>

              <Grid item xs={12} sm={12}>
                {discoveryIsLoading ? (
                  <LinearLoader labelText={discoveryLoadingLabel} />
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6}>
                      <Button
                        className={classes.itemGrid}
                        variant="outlined"
                        component="span"
                        color="primary"
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
                        color="primary"
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
