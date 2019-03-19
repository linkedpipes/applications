// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import { LinearLoader } from '@components';
import Grid from '@material-ui/core/Grid';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core';
import { DiscoverSimpleSelector, DiscoverAdvancedSelector } from './children';

type Props = {
  classes: {
    root: {
      textAlign: string,
      paddingTop: number,
      flex: number
    },
    gridRoot: {
      flexGrow: number
    },
    itemGrid: {
      height: string,
      width: string,
      margin: string
    },
    textField: {
      margin: string,
      width: string
    },
    card: {
      flexGrow: number
    }
  },
  dataSampleIri: string,
  dataSampleTextFieldValue: string,
  dataSourcesUris: string,
  discoveryIsLoading: boolean,
  discoveryLoadingLabel: string,
  namedGraph: string,
  namedTextFieldValue: string,
  onHandleChangeIndex: PropTypes.func,
  onHandleProcessStartDiscovery: () => void,
  onHandleSelectedFile: () => void,
  onHandleSetDataSampleIri: () => void,
  onHandleSetNamedGraph: () => void,
  onHandleSetSparqlIri: () => void,
  onHandleTabChange: () => void,
  onValidateField: () => void,
  sparqlEndpointIri: string,
  sparqlTextFieldValue: string,
  tabValue: number,
  textFieldIsValid: boolean,
  textFieldValue: string,
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
  tabValue,
  dataSourcesUris,
  textFieldValue,
  ttlFile,
  textFieldIsValid,
  sparqlEndpointIri,
  dataSampleIri,
  onHandleTabChange,
  onHandleChangeIndex,
  onHandleSelectedFile,
  onValidateField,
  onHandleProcessStartDiscovery,
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
      {discoveryIsLoading ? (
        <LinearLoader labelText={discoveryLoadingLabel} />
      ) : (
        <div className={classes.gridRoot}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <AppBar position="static" color="default">
                <Tabs
                  value={tabValue}
                  onChange={onHandleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Simple" />
                  <Tab label="Advanced" />
                </Tabs>
              </AppBar>
            </Grid>

            <Grid item xs={12} sm={12}>
              <SwipeableViews
                axis="x"
                index={tabValue}
                onChangeIndex={onHandleChangeIndex}
              >
                <DiscoverSimpleSelector
                  classes={classes}
                  dataSourcesUris={dataSourcesUris}
                  discoveryIsLoading={discoveryIsLoading}
                  textFieldValue={textFieldValue}
                  handleValidateField={onValidateField}
                  handleSelectedFile={onHandleSelectedFile}
                />
                <DiscoverAdvancedSelector
                  classes={classes}
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
              </SwipeableViews>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                className={classes.itemGrid}
                variant="contained"
                component="span"
                color="secondary"
                disabled={
                  tabValue === 0
                    ? !ttlFile && !textFieldIsValid && dataSourcesUris === ''
                    : sparqlEndpointIri === '' || dataSampleIri === ''
                }
                onClick={onHandleProcessStartDiscovery}
                size="small"
              >
                Start Discovery
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </CardContent>
  </Card>
);

export default withStyles(styles)(DiscoverSelectorComponent);
