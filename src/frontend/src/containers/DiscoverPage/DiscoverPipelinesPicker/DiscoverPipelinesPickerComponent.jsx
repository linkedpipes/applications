import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DiscoverPipelinesHeader from './DiscoverPipelinesHeaderComponent';
import uuid from 'uuid';

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
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    flex: 1
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

const DiscoverPipelinesPickerComponent = ({
  classes,
  order,
  orderBy,
  dataSourceGroups,
  rowsPerPage,
  page,
  loadingButtons,
  emptyRows,
  onSelectPipeline
}) => (
  <Paper className={classes.root}>
    <div className={classes.tableWrapper}>
      <Table className={classes.table} aria-labelledby="tableTitle">
        <DiscoverPipelinesHeader />
        <TableBody>
          {dataSourceGroups
            .sort(getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(datasourceAndPipelines => {
              return (
                <TableRow hover tabIndex={-1} key={uuid()}>
                  <TableCell component="th" scope="row" padding="checkbox">
                    <Button
                      id={`button_${datasourceAndPipelines.dataSources[0].uri}`}
                      size="small"
                      disabled={Object.keys(loadingButtons).length > 0}
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        onSelectPipeline(datasourceAndPipelines);
                      }}
                    >
                      Select
                    </Button>
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

DiscoverPipelinesPickerComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  dataSourceGroups: PropTypes.any,
  discoveryId: PropTypes.any,
  emptyRows: PropTypes.any,
  exportAndStartPolling: PropTypes.any,
  loadingButtons: PropTypes.any,
  order: PropTypes.any,
  orderBy: PropTypes.any,
  page: PropTypes.any,
  rowsPerPage: PropTypes.any
};

export default withStyles(styles)(DiscoverPipelinesPickerComponent);
