import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import connect from "react-redux/lib/connect/connect";
import Button from "@material-ui/core/Button";
import {
  getExecutePipeline,
  getExportPipeline,
  getExecutionStatus
} from "../../_services/discovery.service";
import { addSingleExecution } from "../../_actions/etl_executions";
import { addSingleExport } from "../../_actions/etl_exports";
import { toast } from "react-toastify";
import { ETL_STATUS_MAP, ETL_STATUS_TYPE } from "../../_constants";
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
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name"
  },
  {
    id: "descriptor",
    numeric: false,
    disablePadding: false,
    label: "Descriptor"
  }
];

const EXECUTION_STATUS_TIMEOUT = 10000;

class PipelinesTableHead extends React.Component {
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

PipelinesTableHead.propTypes = {
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

class PipelinesTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "id",
    page: 0,
    rowsPerPage: 5,
    loadingButtons: {}
  };

  exportAndStartPolling = (discoveryId, pipelineId) => {
    const self = this;

    self.exportPipeline(discoveryId, pipelineId).then(function(json) {
      self
        .executePipeline(json.pipelineId, json.etlPipelineIri)
        .then(function(pipelineId) {
          let loadingButtons = self.state.loadingButtons;
          loadingButtons["button_" + json.pipelineId] = true;
          self.setState({ loadingButtons: loadingButtons });
          self.checkExecutionStatus(pipelineId);
        });
    });
  };

  exportPipeline = (discoveryId, pipelineId) => {
    const self = this;

    let tid = toast.info("Sending the execute pipeline request...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    return getExportPipeline({
      discoveryId: discoveryId,
      pipelineId: pipelineId
    })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          toast.update(tid, {
            render: "Error sending the export pipeline request",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
          console.error(error);
        }
      )
      .then(function(json) {
        if (toast.isActive(tid)) {
          toast.update(tid, {
            render: `Export pipeline request sent!`,
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });
        } else {
          toast.success(`Export pipeline request sent!`, { autoClose: 2000 });
        }

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

    let tid = toast.info("Sending the execute pipeline request...", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false
    });

    return getExecutePipeline({ etlPipelineIri: etlPipelineIri })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          toast.update(tid, {
            render: "Error sending the execute pipeline request",
            type: toast.TYPE.ERROR,
            autoClose: 2000
          });
          console.error(error);
        }
      )
      .then(function(json) {
        if (toast.isActive(tid)) {
          toast.update(tid, {
            render: `Execute pipeline request sent!`,
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });
        } else {
          toast.success(`Execute pipeline request sent!`, { autoClose: 2000 });
        }

        self.props.dispatch(
          addSingleExecution({
            id: pipelineId,
            executionIri: json.iri
          })
        );

        return pipelineId;
      });
  };

  checkExecutionStatus = (pipelineId, tid) => {
    const { executions } = this.props;
    const executionValues = executions.executions[pipelineId];
    let status = undefined;
    const self = this;

    if (tid === undefined) {
      tid = toast.info("Checking the pipeline execution status...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false
      });
    }

    return getExecutionStatus({ executionIri: executionValues.executionIri })
      .then(
        function(response) {
          return response.json();
        },
        function(error) {
          toast.update(tid, {
            render: "Error while checking the execution status",
            type: toast.TYPE.ERROR,
            autoClose: EXECUTION_STATUS_TIMEOUT
          });
          console.error(error);
        }
      )
      .then(function(json) {
        let response = "Status: ";
        let status = ETL_STATUS_MAP[json.status.id];

        if (status === undefined) {
          toast.update(tid, {
            render: "Unkown status",
            type: toast.TYPE.ERROR,
            autoClose: EXECUTION_STATUS_TIMEOUT
          });
        }

        response += status;

        if (toast.isActive(tid)) {
          toast.update(tid, {
            render: response,
            type: toast.TYPE.SUCCESS,
            autoClose: EXECUTION_STATUS_TIMEOUT
          });
        } else {
          toast.info(response, { autoClose: EXECUTION_STATUS_TIMEOUT });
        }

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed
        ) {
          let loadingButtons = self.state.loadingButtons;
          loadingButtons["button_" + pipelineId] = false;
          self.setState({ loadingButtons: loadingButtons });
        } else {
          setTimeout(() => {
            self.checkExecutionStatus(pipelineId, tid);
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

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, pipelines, discoveryId, exportsDict } = this.props;
    const { order, orderBy, rowsPerPage, page, loadingButtons } = this.state;

    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, pipelines.length - page * rowsPerPage);

    const self = this;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <PipelinesTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={self.handleRequestSort}
              rowCount={pipelines.length}
            />
            <TableBody>
              {pipelines
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(pipeline => {
                  return (
                    <TableRow hover tabIndex={-1} key={pipeline.id}>
                      <TableCell component="th" scope="row" padding="checkbox">
                        {loadingButtons["button_" + pipeline.id] ? (
                          <CircularProgress size={25} />
                        ) : (
                          <Button
                            id={"button_" + pipeline.id}
                            size="small"
                            variant="contained"
                            disabled={loadingButtons.length > 1}
                            color="secondary"
                            onClick={() => {
                              self.exportAndStartPolling(
                                discoveryId,
                                pipeline.id
                              );
                            }}
                          >
                            Execute
                          </Button>
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {pipeline.name}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {pipeline.descriptor}
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
        <TablePagination
          component="div"
          count={pipelines.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={self.handleChangePage}
          onChangeRowsPerPage={self.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

PipelinesTable.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    exportsDict: state.etl_exports,
    executions: state.etl_executions
  };
};

export default connect(mapStateToProps)(withStyles(styles)(PipelinesTable));
