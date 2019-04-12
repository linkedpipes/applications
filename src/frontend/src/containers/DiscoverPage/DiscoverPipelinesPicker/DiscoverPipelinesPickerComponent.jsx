// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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

type Props = {
  classes: Object,
  order: any,
  orderBy: any,
  dataSourceGroups: Object,
  rowsPerPage: any,
  page: any,
  loadingButtons: Object,
  emptyRows: Object,
  onSelectPipeline: Function
};

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
}: Props) => (
  <Paper className={classes.root}>
    <div className={classes.tableWrapper}>
      <Table className={classes.table} aria-labelledby="tableTitle">
        <DiscoverPipelinesHeader />
        <TableBody>
          {dataSourceGroups
            .sort(getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((datasourceAndPipelines, index) => {
              return (
                <TableRow hover tabIndex={-1} key={uuid()}>
                  <TableCell component="th" scope="row" padding="checkbox">
                    <Button
                      id={`button-${index}-pipeline`}
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

export default withStyles(styles)(DiscoverPipelinesPickerComponent);
