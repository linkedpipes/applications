import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const rows = [
  {
    id: 'label',
    disablePadding: true,
    label: 'Label'
  },
  {
    id: 'uri',
    disablePadding: false,
    label: 'Uri'
  }
];

const DiscoverPipelinesHeaderComponent = () => (
  <TableHead>
    <TableRow>
      <TableCell component="th" scope="row" padding="dense">
        Action
      </TableCell>
      {rows.map(row => {
        return (
          <TableCell key={row.id} align="left">
            {row.label}
          </TableCell>
        );
      }, this)}
    </TableRow>
  </TableHead>
);

export default DiscoverPipelinesHeaderComponent;
