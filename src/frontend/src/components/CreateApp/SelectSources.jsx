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

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20,
    flex: 1
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
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
    textFieldIsValid: false
  };

  onChange = e => {
    toast.success("File uploaded", { autoClose: 1500 });
    this.setState({ ttlFile: e.target.files[0] });
  };

  postStartFromFile = () => {
    let tid = toast.info("Running the discovery...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    DiscoveryService.postDiscoverFromTtl({ ttlFile: self.state.ttlFile })
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
          self.setState({ discoveryIsLoading: false });
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

        self.setState({
          discoveryIsLoading: false
        });
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

    console.log(datasourcesForTTL);

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
          self.setState({ discoveryIsLoading: false });
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
    console.log(process.env.BASE_BACKEND_URL);

    const self = this;

    self.setState({ discoveryIsLoading: true });

    if (self.state.ttlFile) {
      self.postStartFromFile();
    } else {
      self.postStartFromInputLinks().then(function(discoveryResponse) {
        self.addDiscoveryId(discoveryResponse.id).then(function() {
          self
            .loadPipelineGroups(discoveryResponse.id)
            .then(function(pipelinesResponse) {
              console.log(pipelinesResponse);

              self.setState({
                discoveryIsLoading: false
              });

              setTimeout(function() {
                self.props.handleNextStep();
              }, 500);
            });
        });
      });
    }
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
        console.log(jsonResponse);

        toast.dismiss(tid);
        self.props.dispatch(
          addVisualizer({ visualizersArray: jsonResponse.pipelineGroups })
        );
        return jsonResponse;
      });
  };

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
  };

  render() {
    const { classes } = this.props;

    const { discoveryIsLoading, textFieldValue, textFieldIsValid } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          <TextField
            id="outlined-textarea"
            label="Sources validator"
            disabled={discoveryIsLoading}
            multiline
            value={textFieldValue}
            onChange={this.validateField}
            placeholder="Input your sources..."
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </CardContent>

        <CardActions>
          {discoveryIsLoading ? (
            <LinearLoadingIndicator labelText="Processing sources through Discovery, hang in there 😉" />
          ) : (
            <div>
              {/*
              <input
                accept=".ttl"
                className={classes.input}
                onChange={this.onChange}
                id="contained-button-file"
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                  size="small"
                >
                  Select TTL file
                </Button>

              </label>
             */}
              <Button
                variant="contained"
                component="span"
                className={classes.button}
                disabled={!this.state.ttlFile && !textFieldIsValid}
                onClick={this.processStartDiscovery}
                size="small"
              >
                Start Discovery
              </Button>

              {this.props.discoveryId && (
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                  disabled={!this.props.discoveryId}
                  onClick={this.props.handleNextStep}
                  size="small"
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </CardActions>
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
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(withStyles(styles)(SelectSources));
