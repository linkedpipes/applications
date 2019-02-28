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
import {
  setSelectedDatasourcesExample,
  changeTabAction
} from "../../_actions/globals";
import SimpleSourcesInput from "./InputModes/Simple/SimpleSourcesInput";

// const styles = theme => ({
//   root: {
//     textAlign: 'center',
//     paddingTop: theme.spacing.unit * 20,
//     flex: 1
//   },
//   gridRoot: {
//     flexGrow: 1
//   },
//   itemGrid: {
//     height: '100%',
//     width: '100%',
//     margin: 'auto'
//   },
//   textField: {
//     margin: 'auto',
//     width: '100%'
//   },
//   card: {
//     flexGrow: 1
//   }
// });

// class SelectSources extends React.Component {
//   state = {
//     ttlFile: undefined,
//     discoveryIsLoading: false,
//     textFieldValue: '',
//     textFieldIsValid: false,
//     open: false,
//     discoveryStatusPolling: undefined,
//     discoveryStatusPollingFinished: false,
//     discoveryStatusPollingInterval: 2000,
//     discoveryLoadingLabel: '',
//     tabValue: 0,
//     sparqlEndpointIri: '',
//     dataSampleIri: '',
//     namedGraph: ''
//   };

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
    sparqlTextFieldValue: "",
    dataSampleTextFieldValue: "",
    namedTextFieldValue: ""
  };

  handleChange = (event, newValue) => {
    this.props.dispatch(
      changeTabAction({
        selectedTab: newValue
      })
    );
    // this.setState({
    //   tabValue: newValue
    // });
  };

  handleChangeIndex = index => {
    this.props.dispatch(
      changeTabAction({
        selectedTab: index
      })
    );
    // this.setState({
    //   tabValue: index
    // });
  };

//   postStartFromFile = () => {
//     const self = this;
//     return DiscoveryService.postDiscoverFromTtl({
//       ttlFile: self.state.ttlFile
//     }).then((response) => {
//       return response.json();
//     });
//   };

//   // TODO: refactor later, move to separate class responsible for _services calls
//   postStartFromInputLinks = () => {
//     const textContent =
//       this.props.selectedDatasources !== undefined
//         ? this.props.selectedDatasources
//         : this.state.textFieldIsValid;

//     const splitFieldValue = textContent.split(',\n');
//     const datasourcesForTTL = splitFieldValue.map(source => {
//       return { uri: source };
//     });

//     if (this.props.selectedDatasources !== undefined) {
//       // Clear out selected sources that failed
//       this.props.dispatch(
//         setSelectedDatasourcesExample({
//           data: undefined
//         })
//       );
//     }

//     return DiscoveryService.postDiscoverFromUriList({
//       datasourceUris: datasourcesForTTL
//     }).then((response) => {
//       return response.json();
//     });
//   };

//   postStartFromSparqlEndpoint = () => {
//     return DiscoveryService.postDiscoverFromEndpoint({
//       sparqlEndpointIri: this.state.sparqlEndpointIri,
//       dataSampleIri: this.state.dataSampleIri,
//       namedGraph: this.state.namedGraph
//     }).then((response) => {
//       return response.json();
//     });
//   };

  postStartFromSparqlEndpoint = () => {
    return DiscoveryService.postDiscoverFromEndpoint({
      sparqlEndpointIri: !this.props.sparqlEndpointIri
        ? this.state.sparqlTextFieldValue
        : this.props.sparqlEndpointIri,
      dataSampleIri: !this.props.dataSampleIri
        ? dataSampleTextFieldValue
        : this.props.dataSampleIri,
      namedGraph: !this.props.namedGraph
        ? namedTextFieldValue
        : this.props.namedGraph
    }).then(function(response) {
      return response.json();
    });
  };

//     return new Promise((resolve, reject) => {
//       self.props.dispatch(
//         addDiscoveryIdAction({
//           id: discoveryId
//         })
//       );
//       resolve();
//     });
//   };

//   handleDiscoveryInputCase = () => {
//     if (this.state.tabValue === 1) {
//       return this.postStartFromSparqlEndpoint();
//     }
//     if (this.state.ttlFile) {
//       return this.postStartFromFile();
//     }
//     return this.postStartFromInputLinks();
//   };

  handleDiscoveryInputCase = () => {
    if (this.props.selectedTab === 1) {
      return this.postStartFromSparqlEndpoint();
    } else {
      if (this.state.ttlFile) {
        return this.postStartFromFile();
      } else {
        return this.postStartFromInputLinks();
      }
    }
  };

//     self.setState({
//       discoveryIsLoading: true,
//       discoveryLoadingLabel:
//         'Please, hold on Discovery is casting spells 🧙‍...'
//     });

//     self
//       .handleDiscoveryInputCase()
//       .then((discoveryResponse) => {
//         if (discoveryResponse !== undefined) {
//           self.addDiscoveryId(discoveryResponse).then(function() {
//             self.setState({ discoveryStatusPollingFinished: false });
//             self.checkDiscovery(discoveryResponse, undefined);
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error.message);

//         // Enable the fields
//         self.setState({
//           discoveryIsLoading: false,
//           textFieldValue: '',
//           textFieldIsValid: true
//         });

//         // Clear out selected sources that failed
//         self.props.dispatch(
//           setSelectedDatasourcesExample({
//             data: undefined
//           })
//         );

//         toast.error(
//           'There was an error during the discovery. Please, try different sources.',
//           {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 2000
//           }
//         );
//       });
//   };

//   checkDiscovery = response => {
//     const self = this;
//     const discoveryId = response.id;

//     this.state.discoveryStatusPolling &&
//       clearTimeout(this.state.discoveryStatusPolling);

//     if (this.state.discoveryStatusPollingFinished) {
//       this.setState({ polling: undefined });

//       self.loadPipelineGroups(discoveryId).then((pipelinesResponse) => {
//         console.log(pipelinesResponse);

//         self.setState({
//           discoveryIsLoading: false
//         });

//         setTimeout(function() {
//           self.props.handleNextStep();
//         }, 500);
//       });

//       return;
//     }

//     DiscoveryService.getDiscoveryStatus({ discoveryId })
//       .then((response) => {
//         return response.json();
//       })
//       .then((jsonResponse) => {
//         self.setState({
//           discoveryStatusPollingFinished: jsonResponse.isFinished
//         });
//       });

//     const discoveryStatusPolling = setTimeout(() => {
//       this.checkDiscovery(response);
//     }, this.state.discoveryStatusPollingInterval);

//     this.setState({
//       discoveryStatusPolling
//     });
//   };

//   loadPipelineGroups = discoveryId => {
//     this.setState({
//       discoveryLoadingLabel: 'Extracting the magical pipelines 🧙‍...'
//     });

//     const self = this;

//     return DiscoveryService.getPipelineGroups({ discoveryId })
//       .then((response) => {
//         return response.json();
//       })
//       .then((jsonResponse) => {
//         self.props.dispatch(
//           addVisualizer({ visualizersArray: jsonResponse.pipelineGroups })
//         );
//         return jsonResponse;
//       });
//   };

//   handleValidation = rawText => {
//     const matches = extractUrlGroups(rawText);
//     let valid = false;

//     if (matches instanceof Array) {
//       rawText = matches.join(',\n');
//       valid = true;
//     }

//     this.setState({
//       textFieldValue: rawText,
//       textFieldIsValid: valid
//     });

//     if (this.props.selectedDatasources !== undefined) {
//       this.props.dispatch(
//         setSelectedDatasourcesExample({
//           data: undefined
//         })
//       );
//     }
//   };

//   handleSelectedFile = fileItems => {
//     this.setState({
//       ttlFile: fileItems.length === 1 ? fileItems[0].file : undefined
//     });
//   };

//   validateField = e => {
//     const rawText = e.target.value;
//     this.handleValidation(rawText);
//   };

//   setSparqlIri = e => {
//     const rawText = e.target.value;
//     this.setState({
//       sparqlEndpointIri: rawText
//     });
//   };

  setSparqlIri = e => {
    let rawText = e.target.value;
    this.setState({
      sparqlTextFieldValue: rawText
    });
  };

  setDataSampleIri = e => {
    let rawText = e.target.value;
    this.setState({
      dataSampleTextFieldValue: rawText
    });
  };

  setNamedGraph = e => {
    let rawText = e.target.value;
    this.setState({
      namedTextFieldValue: rawText
    });
  };

  render() {
    const {
      classes,
      selectedDatasources,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph,
      selectedTab
    } = this.props;
    const self = this;

    const {
      discoveryIsLoading,
      textFieldValue,
      textFieldIsValid,
      discoveryLoadingLabel,
      sparqlTextFieldValue,
      dataSampleTextFieldValue,
      namedTextFieldValue
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
                      value={selectedTab}
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
                    index={selectedTab}
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
                      namedGraphTextFieldHandler={self.setNamedGraph}
                      sparqlEndpointIri={sparqlEndpointIri}
                      dataSampleIri={dataSampleIri}
                      namedGraph={namedGraph}
                      sparqlTextFieldValue={sparqlTextFieldValue}
                      dataSampleTextFieldValue={dataSampleTextFieldValue}
                      namedTextFieldValue={namedTextFieldValue}
                    />
                  </SwipeableViews>
                </Grid>

// SelectSources.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// const mapStateToProps = state => {
//   return {
//     datasources: getDatasourcesArray(state.datasources),
//     discoveryId: state.globals.discoveryId,
//     selectedDatasources: state.globals.datasourcesValues
//   };
// };

const mapStateToProps = state => {
  return {
    datasources: getDatasourcesArray(state.datasources),
    discoveryId: state.globals.discoveryId,
    selectedDatasources: state.globals.datasourcesValues,
    sparqlEndpointIri: state.globals.sparqlEndpointIri,
    dataSampleIri: state.globals.dataSampleIri,
    namedGraph: state.globals.namedGraph,
    selectedTab: state.globals.selectedTab
  };
};
