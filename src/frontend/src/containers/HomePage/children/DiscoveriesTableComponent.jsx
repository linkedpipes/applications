// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

type Props = {
  discoveriesList: Array<{ id: string, finished: boolean }>
};

const DiscoveriesTableComponent = ({ discoveriesList }: Props) => (
  <div>
    {discoveriesList && discoveriesList.length > 0 ? (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Discovery ID</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discoveriesList.map(discovery => (
              <TableRow key={discovery.id}>
                <TableCell align="left">{discovery.id}</TableCell>
                <TableCell align="left">
                  {discovery.finished ? 'Finished' : 'In progress'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    ) : (
      <Paper>
        <Typography variant="body1" gutterBottom>
          No discoveries found
        </Typography>
      </Paper>
    )}
  </div>
);

export default DiscoveriesTableComponent;
