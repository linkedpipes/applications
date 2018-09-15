import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import PipelinesTable from "./PipelinesTable";
import AddDatasourceDialog from "./AddDatasourceDialog";
import { addPipelines } from "../actions/pipelines";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postDiscoverFromTtl, getPipelineGroups } from "../api/api";
import ChipInput from "material-ui-chip-input";
import { addSource, removeSource } from "../actions/datasources";
import { url_domain } from "../utils";
import getDatasourcesArray from "../selectors/datasources";

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
    discoveryId: "",
    addDatasourceDialogOpen: false,
    discoveryDialogOpen: false,
    pipelinesDialogOpen: false
  };

  handleClose = () => {
    this.setState({
      addDatasourceDialogOpen: false,
      discoveryDialogOpen: false,
      pipelinesDialogOpen: false
    });
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
    postDiscoverFromTtl({ ttlFile: self.state.ttlFile })
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

        self.setState({
          discoveryId: jsonResponse.id
        });
      });
  };

  // TODO: refactor later, move to separate class responsible for api calls
  postStartFromLinks = () => {
    const { datasourceUris } = this.props;

    let tid = toast.info("Getting the pipeline groups...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    postStartFromLinks({ datasourceUris: datasourceUris })
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

        self.setState({
          discoveryId: jsonResponse.id
        });
      });
  };

  processStartDiscovery = () => {
    if (this.state.ttlFile) {
      this.postStartFromFile();
    } else {
      this.postStartFromLinks();
    }
  };

  loadPipelineGroups = () => {
    let tid = toast.info("Getting the pipeline groups...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    const self = this;
    getPipelineGroups({ discoveryId: self.state.discoveryId })
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
          addPipelines({ pipelinesArray: jsonResponse.pipelines })
        );

        self.setState({
          pipelinesDialogOpen: true
        });
      });
  };

  handleAddSource = chip => {
    const name = url_domain(chip);
    const uri = chip;

    this.props.dispatch(addSource({ name: name, url: uri }));
  };

  handleDeleteSource = chip => {
    this.props.dispatch(removeSource({ url: chip }));
  };

  render() {
    const { classes, datasources } = this.props;

    const {
      discoveryDialogOpen,
      discoveryId,
      pipelinesDialogOpen,
      addDatasourceDialogOpen
    } = this.state;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="title" component="h1">
            Select Data Sources
          </Typography>
          <Typography variant="body1" gutterBottom>
            Select data source for your new application
          </Typography>
          <ChipInput
            value={datasources}
            onAdd={chip => this.handleAddSource(chip)}
            onDelete={chip => this.handleDeleteSource(chip)}
          />
        </CardContent>

        <CardActions>
          <Dialog open={discoveryDialogOpen} onClose={this.handleClose}>
            <DialogTitle>Discovery Response</DialogTitle>
            <DialogContent>
              <DialogContentText>Your id is : {discoveryId}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>

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

          <AddDatasourceDialog />

          <Button
            variant="contained"
            component="span"
            className={classes.button}
            disabled={this.state.ttlFile}
            onClick={this.displayDatasourcesPopup}
            size="small"
          >
            Add URL
          </Button>

          <Button
            variant="contained"
            component="span"
            className={classes.button}
            disabled={!this.state.ttlFile && datasources.length === 0}
            onClick={this.processStartDiscovery}
            size="small"
          >
            Start
          </Button>

          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={pipelinesDialogOpen}
            onClose={this.handleClose}
          >
            <DialogTitle>
              <Typography variant="headline" gutterBottom>
                Pipelines Browser
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Each discovered pipeline presents a sequence of transformations
                that have to be applied to the data so that it can be visualized
                using this visualizer. Notice that different pipelines will give
                different outputs. You need to try them manually.
              </Typography>
              <p>
                <Typography variant="body2">
                  To create an application, first run a pipeline from the table
                  below.
                </Typography>
              </p>
              <PipelinesTable />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            variant="contained"
            component="span"
            className={classes.button}
            disabled={!this.state.discoveryId}
            onClick={this.loadPipelineGroups}
            size="small"
          >
            Browse Pipelines
          </Button>
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
    datasources: getDatasourcesArray(state.datasources)
  };
};

export default connect(mapStateToProps)(withStyles(styles)(SelectSources));
