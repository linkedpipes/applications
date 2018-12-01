import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { addVisualizer } from "../../_actions/visualizers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DiscoveryService } from "../../_services";
import { extractUrlGroups } from "../../_helpers";
import { getDatasourcesArray } from "../../_selectors/datasources";
import LinearLoadingIndicator from "../Loaders/LinearLoadingIndicator";
import { addDiscoveryIdAction } from "../../_actions/globals";
import Grid from "@material-ui/core/Grid";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { FilePond, File, registerPlugin } from "react-filepond";
import { setSelectedDatasourcesExample } from "../../_actions/globals";
import "filepond/dist/filepond.min.css";

// Register the plugins
registerPlugin(FilePondPluginFileValidateType);

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
    height: "100%",
    width: "100%"
  },
  card: {
    flexGrow: 1
  },
  chip: {
    margin: theme.spacing.unit / 2
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
    discoveryStatusPollingInterval: 2000
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  postStartFromFile = () => {
    let tid = toast.info("Running the discovery...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    return DiscoveryService.postDiscoverFromTtl({ ttlFile: self.state.ttlFile })
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          toast.update(tid, {
            render: "There was an error during the discovery",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
        }
      )
      .then(function(jsonResponse) {
        if (toast.isActive(tid)) {
          toast.update(tid, {
            render: `Discovery id ${jsonResponse.id}`,
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });
        } else {
          toast.success(`Discovery id ${jsonResponse.id}`, { autoClose: 2000 });
        }

        return jsonResponse;
      });
  };

  // TODO: refactor later, move to separate class responsible for _services calls
  postStartFromInputLinks = () => {
    const splitFieldValue = this.state.textFieldValue.split(",\n");
    const datasourcesForTTL = splitFieldValue.map(source => {
      return { uri: source };
    });

    let tid = toast.info("Getting the pipeline groups...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    return DiscoveryService.postDiscoverFromUriList({
      datasourceUris: datasourcesForTTL
    })
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          toast.update(tid, {
            render: "There was an error during the discovery",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
        }
      )
      .then(function(jsonResponse) {
        if (toast.isActive(tid)) {
          toast.update(tid, {
            render: `Discovery id ${jsonResponse.id}`,
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });
        } else {
          toast.success(`Discovery id ${jsonResponse.id}`, { autoClose: 2000 });
        }

        return jsonResponse;
      });
  };

  addDiscoveryId = id => {
    const self = this;

    return new Promise((resolve, reject) => {
      self.props.dispatch(
        addDiscoveryIdAction({
          id: id
        })
      );
      resolve();
    });
  };

  processStartDiscovery = () => {
    const self = this;

    self.setState({ discoveryIsLoading: true });

    if (self.state.ttlFile) {
      self.postStartFromFile().then(function(discoveryResponse) {
        self.addDiscoveryId(discoveryResponse.id).then(function() {
          self.setState({ discoveryStatusPollingFinished: false });
          self.checkDiscovery(discoveryResponse.id, undefined);
        });
      });
    } else {
      self.postStartFromInputLinks().then(function(discoveryResponse) {
        self.addDiscoveryId(discoveryResponse.id).then(function() {
          self.setState({ discoveryStatusPollingFinished: false });
          self.checkDiscovery(discoveryResponse.id, undefined);
        });
      });
    }
  };

  checkDiscovery = (discoveryId, tid) => {
    const self = this;

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

    tid =
      tid === undefined
        ? toast.info("Please, hold on Discovery is casting spells 🧙‍...", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false
          })
        : tid;

    DiscoveryService.getDiscoveryStatus({ discoveryId: discoveryId })
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          toast.update(tid, {
            render: "Error during discovery run",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
        }
      )
      .then(function(jsonResponse) {
        self.setState({
          discoveryStatusPollingFinished: jsonResponse.isFinished
        });
        if (jsonResponse.isFinished) {
          toast.dismiss(tid);
        }
      });

    const discoveryStatusPolling = setTimeout(() => {
      this.checkDiscovery(discoveryId, tid);
    }, this.state.discoveryStatusPollingInterval);

    this.setState({
      discoveryStatusPolling
    });
  };

  loadPipelineGroups = discoveryId => {
    let tid = toast.info("Getting the pipeline groups...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    return DiscoveryService.getPipelineGroups({ discoveryId: discoveryId })
      .then(
        function(response) {
          return response.json();
        },
        function(err) {
          toast.update(tid, {
            render: "Error getting pipeline groups",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
        }
      )
      .then(function(jsonResponse) {
        toast.dismiss(tid);
        self.props.dispatch(
          addVisualizer({ visualizersArray: jsonResponse.pipelineGroups })
        );
        return jsonResponse;
      });
  };

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  validateField = e => {
    let rawText = e.target.value;
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

  render() {
    const { classes, selectedDatasources } = this.props;

    const { discoveryIsLoading, textFieldValue, textFieldIsValid } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          {discoveryIsLoading ? (
            <LinearLoadingIndicator labelText="Processing sources through Discovery, hang in there 😉" />
          ) : (
            <div className={classes.gridRoot}>
              <Grid container spacing={24}>
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
                    onChange={this.validateField}
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
                    oninit={() => this.handleInit()}
                    onupdatefiles={fileItems => {
                      // Set current file objects to this.state
                      this.setState({
                        ttlFile: fileItems[0].file
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Button
                    className={classes.itemGrid}
                    variant="contained"
                    component="span"
                    color="secondary"
                    disabled={
                      !this.state.ttlFile &&
                      !textFieldIsValid &&
                      selectedDatasources === undefined
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

export default connect(mapStateToProps)(withStyles(styles)(SelectSources));

// {this.props.discoveryId && (
//   <Button
//     variant="contained"
//     component="span"
//     className={classes.button}
//     disabled={!this.props.discoveryId}
//     onClick={this.props.handleNextStep}
//     size="small"
//   >
//     Next
//   </Button>
// )}
