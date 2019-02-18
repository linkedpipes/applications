import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { addVisualizer } from "../../_actions/visualizers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DiscoveryService } from "../../_services";
import { extractUrlGroups } from "../../_helpers";
import { getDatasourcesArray } from "../../_selectors/datasources";
import LinearLoadingIndicator from "../Loaders/LinearLoadingIndicator";
import { addDiscoveryIdAction } from "../../_actions/globals";
import Grid from "@material-ui/core/Grid";
import { setSelectedDatasourcesExample } from "../../_actions/globals";
import SimpleSourcesInput from "./InputModes/Simple/SimpleSourcesInput";

import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AdvancedSourcesInput from "./InputModes/Advanced/AdvancedSourcesInput";

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20,
    flex: 1
  },
  gridRoot: {
    flexGrow: 1
  },
  itemGrid: {
    height: "100%",
    width: "100%",
    margin: "auto"
  },
  textField: {
    margin: "auto",
    width: "100%"
  },
  card: {
    flexGrow: 1
  }
});

class SelectSources extends React.Component {
  state = {
    ttlFile: undefined,
    discoveryIsLoading: false,
    textFieldValue: "",
    textFieldIsValid: false,
    open: false,
    discoveryStatusPolling: undefined,
    discoveryStatusPollingFinished: false,
    discoveryStatusPollingInterval: 2000,
    discoveryLoadingLabel: "",
    tabValue: 0,
    sparqlEndpointIri: "",
    dataSampleIri: ""
  };

  handleChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  };

  handleChangeIndex = index => {
    this.setState({
      tabValue: index
    });
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  postStartFromFile = () => {
    const self = this;
    return DiscoveryService.postDiscoverFromTtl({
      ttlFile: self.state.ttlFile
    }).then(function(response) {
      return response.json();
    });
  };

  // TODO: refactor later, move to separate class responsible for _services calls
  postStartFromInputLinks = () => {
    const textContent =
      this.props.selectedDatasources !== undefined
        ? this.props.selectedDatasources
        : this.state.textFieldIsValid;

    const splitFieldValue = textContent.split(",\n");
    const datasourcesForTTL = splitFieldValue.map(source => {
      return { uri: source };
    });

    if (this.props.selectedDatasources !== undefined) {
      // Clear out selected sources that failed
      this.props.dispatch(
        setSelectedDatasourcesExample({
          data: undefined
        })
      );
    }

    return DiscoveryService.postDiscoverFromUriList({
      datasourceUris: datasourcesForTTL
    }).then(function(response) {
      return response.json();
    });
  };

  postStartFromSparqlEndpoint = () => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: this.state.sparqlEndpointIri,
      dataSampleIri: this.state.dataSampleIri
    }).then(function(response) {
      return response.json();
    });
  };

  addDiscoveryId = response => {
    const self = this;
    const discoveryId = response.id;

    return new Promise((resolve, reject) => {
      self.props.dispatch(
        addDiscoveryIdAction({
          id: discoveryId
        })
      );
      resolve();
    });
  };

  handleDiscoveryInputCase = () => {
    if (this.state.tabValue === 1) {
      return this.postStartFromSparqlEndpoint();
    } else {
      if (this.state.ttlFile) {
        return this.postStartFromFile();
      } else {
        return this.postStartFromInputLinks();
      }
    }
  };

  processStartDiscovery = () => {
    const self = this;

    self.setState({
      discoveryIsLoading: true,
      discoveryLoadingLabel:
        "Please, hold on Discovery is casting spells 🧙‍..."
    });

    self
      .handleDiscoveryInputCase()
      .then(function(discoveryResponse) {
        if (discoveryResponse !== undefined) {
          self.addDiscoveryId(discoveryResponse).then(function() {
            self.setState({ discoveryStatusPollingFinished: false });
            self.checkDiscovery(discoveryResponse, undefined);
          });
        }
      })
      .catch(function(error) {
        console.log(error.message);

        // Enable the fields
        self.setState({
          discoveryIsLoading: false,
          textFieldValue: "",
          textFieldIsValid: true
        });

        // Clear out selected sources that failed
        self.props.dispatch(
          setSelectedDatasourcesExample({
            data: undefined
          })
        );

        toast.error(
          "There was an error during the discovery. Please, try different sources.",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      });
  };

  checkDiscovery = response => {
    const self = this;
    const discoveryId = response.id;

    this.state.discoveryStatusPolling &&
      clearTimeout(this.state.discoveryStatusPolling);

    if (this.state.discoveryStatusPollingFinished) {
      this.setState({ polling: undefined });

      self.loadPipelineGroups(discoveryId).then(function(pipelinesResponse) {
        console.log(pipelinesResponse);

        self.setState({
          discoveryIsLoading: false
        });

        setTimeout(function() {
          self.props.handleNextStep();
        }, 500);
      });

      return;
    }

    DiscoveryService.getDiscoveryStatus({ discoveryId: discoveryId })
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonResponse) {
        self.setState({
          discoveryStatusPollingFinished: jsonResponse.isFinished
        });
      });

    const discoveryStatusPolling = setTimeout(() => {
      this.checkDiscovery(response);
    }, this.state.discoveryStatusPollingInterval);

    this.setState({
      discoveryStatusPolling
    });
  };

  loadPipelineGroups = discoveryId => {
    this.setState({
      discoveryLoadingLabel: "Extracting the magical pipelines 🧙‍..."
    });

    const self = this;

    return DiscoveryService.getPipelineGroups({ discoveryId: discoveryId })
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonResponse) {
        self.props.dispatch(
          addVisualizer({ visualizersArray: jsonResponse.pipelineGroups })
        );
        return jsonResponse;
      });
  };

  handleValidation = rawText => {
    let matches = extractUrlGroups(rawText);
    let valid = false;

    if (matches instanceof Array) {
      rawText = matches.join(",\n");
      valid = true;
    }

    this.setState({
      textFieldValue: rawText,
      textFieldIsValid: valid
    });

    if (this.props.selectedDatasources !== undefined) {
      this.props.dispatch(
        setSelectedDatasourcesExample({
          data: undefined
        })
      );
    }
  };

  handleSelectedFile = fileItems => {
    this.setState({
      ttlFile: fileItems.length === 1 ? fileItems[0].file : undefined
    });
  };

  validateField = e => {
    let rawText = e.target.value;
    this.handleValidation(rawText);
  };

  setSparqlIri = e => {
    let rawText = e.target.value;
    this.setState({
      sparqlEndpointIri: rawText
    });
  };

  setDataSampleIri = e => {
    let rawText = e.target.value;
    this.setState({
      dataSampleIri: rawText
    });
  };

  render() {
    const { classes, selectedDatasources } = this.props;
    const self = this;
    const {
      discoveryIsLoading,
      textFieldValue,
      textFieldIsValid,
      discoveryLoadingLabel
    } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          {discoveryIsLoading ? (
            <LinearLoadingIndicator labelText={discoveryLoadingLabel} />
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
                      value={self.state.tabValue}
                      onChange={self.handleChange}
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
                    axis={"x"}
                    index={self.state.tabValue}
                    onChangeIndex={self.handleChangeIndex}
                  >
                    <SimpleSourcesInput
                      classes={classes}
                      selectedDatasources={selectedDatasources}
                      discoveryIsLoading={discoveryIsLoading}
                      textFieldValue={textFieldValue}
                      validateField={self.validateField}
                      handleSelectedFile={self.handleSelectedFile}
                    />
                    <AdvancedSourcesInput
                      classes={classes}
                      selectedDatasources={selectedDatasources}
                      discoveryIsLoading={discoveryIsLoading}
                      sparqlTextFieldHandler={self.setSparqlIri}
                      dataSampleTextFieldHandler={self.setDataSampleIri}
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
                      this.state.tabValue === 0
                        ? !this.state.ttlFile &&
                          !textFieldIsValid &&
                          selectedDatasources === undefined
                        : this.state.sparqlEndpointIri === "" ||
                          this.state.dataSampleIri === ""
                    }
                    onClick={this.processStartDiscovery}
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
  }
}

SelectSources.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    datasources: getDatasourcesArray(state.datasources),
    discoveryId: state.globals.discoveryId,
    selectedDatasources: state.globals.datasourcesValues
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(SelectSources)
);
