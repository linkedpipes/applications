import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const DiscoverPipelinesHeaderComponent = (
  order,
  orderBy,
  rows,
  createSortHandler
) => (
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
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <Tooltip
              title="Sort"
              placement={row.numeric ? 'bottom-end' : 'bottom-start'}
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

export default DiscoverPipelinesHeaderComponent;
