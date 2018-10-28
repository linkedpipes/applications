import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import connect from "react-redux/lib/connect/connect";
import Button from "@material-ui/core/Button";
import {
  DiscoveryService,
  ETL_STATUS_MAP,
  ETL_STATUS_TYPE
} from "../../_services";
import { addSingleExecution } from "../../_actions/etl_executions";
import { addSingleExport } from "../../_actions/etl_exports";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: "label",
    numeric: false,
    disablePadding: true,
    label: "Label"
  },
  {
    id: "uri",
    numeric: false,
    disablePadding: false,
    label: "Uri"
  }
];

const EXECUTION_STATUS_TIMEOUT = 10000;

class DataSourcesTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row" padding="dense">
            Action
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

DataSourcesTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    flex: 1
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class DataSourcesTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "id",
    page: 0,
    rowsPerPage: 5,
    loadingButtons: {}
  };

  exportAndStartPolling = (discoveryId, datasourceAndPipelines) => {
    const self = this;
    const pipelines = datasourceAndPipelines.pipelines;
    const randomPipeline =
      pipelines[Math.floor(Math.random() * pipelines.length)];
    const pipelineId = randomPipeline.id;
    const datasourceUri = datasourceAndPipelines.dataSources[0].uri;
    const loadingButtonId = "button_" + datasourceUri;

    self.exportPipeline(discoveryId, pipelineId).then(function(json) {
      self
        .executePipeline(json.pipelineId, json.etlPipelineIri)
        .then(function(pipelineId) {
          let loadingButtons = self.state.loadingButtons;
          loadingButtons[loadingButtonId] = true;
          self.setState({ loadingButtons: loadingButtons });
          self.checkExecutionStatus(pipelineId, loadingButtonId);
        });
    });
  };

  exportPipeline = (discoveryId, pipelineId) => {
    const self = this;

    console.log("Sending the execute pipeline request...");

    return DiscoveryService.getExportPipeline({
      discoveryId: discoveryId,
      pipelineId: pipelineId
    })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          console.log("Error sending the export pipeline request");
          console.error(error);
        }
      )
      .then(function(json) {
        console.log(`Export pipeline request sent!`);

        self.props.dispatch(
          addSingleExport({
            id: json.pipelineId,
            etlPipelineIri: json.etlPipelineIri,
            resultGraphIri: json.resultGraphIri
          })
        );

        return json;
      });
  };

  executePipeline = (pipelineId, etlPipelineIri) => {
    const self = this;

    console.log("Sending the execute pipeline request...");

    return DiscoveryService.getExecutePipeline({
      etlPipelineIri: etlPipelineIri
    })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          console.error(error);
        }
      )
      .then(function(json) {
        console.log(`Execute pipeline request sent!`, { autoClose: 2000 });

        self.props.dispatch(
          addSingleExecution({
            id: pipelineId,
            executionIri: json.iri
          })
        );

        return pipelineId;
      });
  };

  checkExecutionStatus = (pipelineId, loadingButtonId) => {
    const { executions } = this.props;
    const executionValues = executions.executions[pipelineId];
    let status = undefined;
    const self = this;

    return DiscoveryService.getExecutionStatus({
      executionIri: executionValues.executionIri
    })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          console.log("Error while checking the execution status");
          console.error(error);
        }
      )
      .then(function(json) {
        let response = "Status: ";
        let status = ETL_STATUS_MAP[json.status.id];

        if (status === undefined) {
          console.log("Unkown status for checking pipeline execution");
        }

        response += status;

        // TODO : hack value
        response = "Success";

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed ||
          response === "Success"
        ) {
          let loadingButtons = self.state.loadingButtons;
          delete loadingButtons[loadingButtonId];
          self.setState({ loadingButtons: loadingButtons });
          toast.info(response, { autoClose: EXECUTION_STATUS_TIMEOUT });

          setTimeout(function() {
            self.props.handleNextStep();
          }, 500);
        } else {
          setTimeout(() => {
            self.checkExecutionStatus(pipelineId, loadingButtonId);
          }, 5000);
        }
      });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  render() {
    const { classes, dataSourceGroups, discoveryId, exportsDict } = this.props;
    const { order, orderBy, rowsPerPage, page, loadingButtons } = this.state;

    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, dataSourceGroups.length - page * rowsPerPage);

    const self = this;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <DataSourcesTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={self.handleRequestSort}
              rowCount={dataSourceGroups.length}
            />
            <TableBody>
              {dataSourceGroups
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(datasourceAndPipelines => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={datasourceAndPipelines.dataSources[0].uri}
                    >
                      <TableCell component="th" scope="row" padding="checkbox">
                        {loadingButtons[
                          "button_" + datasourceAndPipelines.dataSources[0].uri
                        ] !== undefined ? (
                          <CircularProgress size={25} />
                        ) : (
                          <Button
                            id={
                              "button_" +
                              datasourceAndPipelines.dataSources[0].uri
                            }
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              self.exportAndStartPolling(
                                discoveryId,
                                datasourceAndPipelines
                              );
                            }}
                          >
                            Execute
                          </Button>
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {datasourceAndPipelines.dataSources[0].label}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {datasourceAndPipelines.dataSources[0].uri}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

DataSourcesTable.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    exportsDict: state.etl_exports,
    executions: state.etl_executions
  };
};

export default connect(mapStateToProps)(withStyles(styles)(DataSourcesTable));
