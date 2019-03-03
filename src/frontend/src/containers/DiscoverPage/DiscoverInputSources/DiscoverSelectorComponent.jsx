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
  selectedInputExample,
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
  onHandleSetSparqlIri
}) => (
  <Card className={classes.card}>
    <CardContent>
      {discoveryIsLoading ? (
        <LinearLoader labelText={discoveryLoadingLabel} />
      ) : (
        <div className={classes.gridRoot}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <AppBar
                position="static"
                color="default"
                className={classes.appBar}
              >
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
                  selectedInputExample={selectedInputExample}
                  discoveryIsLoading={discoveryIsLoading}
                  textFieldValue={textFieldValue}
                  validateField={onValidateField}
                  handleSelectedFile={onHandleSelectedFile}
                />
                <DiscoverAdvancedSelector
                  classes={classes}
                  selectedInputExample={selectedInputExample}
                  discoveryIsLoading={discoveryIsLoading}
                  handleSparqlTextFieldChange={onHandleSetSparqlIri}
                  handleDataSampleTextFieldChange={onHandleSetDataSampleIri}
                  handleNamedGraphTextFieldChange={onHandleSetNamedGraph}
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
                    ? !ttlFile &&
                      !textFieldIsValid &&
                      selectedInputExample === undefined
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

DiscoverSelectorComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  dataSampleIri: PropTypes.any,
  discoveryIsLoading: PropTypes.any,
  discoveryLoadingLabel: PropTypes.string,
  onHandleChangeIndex: PropTypes.any,
  onHandleProcessStartDiscovery: PropTypes.any,
  onHandleSelectedFile: PropTypes.any,
  onHandleSetDataSampleIri: PropTypes.any,
  onHandleSetNamedGraph: PropTypes.any,
  onHandleSetSparqlIri: PropTypes.any,
  onHandleTabChange: PropTypes.any,
  onValidateField: PropTypes.any,
  selectedInputExample: PropTypes.any,
  sparqlEndpointIri: PropTypes.any,
  tabValue: PropTypes.any,
  textFieldIsValid: PropTypes.any,
  textFieldValue: PropTypes.any,
  ttlFile: PropTypes.any
};

export default withStyles(styles)(DiscoverSelectorComponent);
