// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid';

type Props = {
  discoveriesList: Array<{ id: string, finished: boolean }>,
  onHandleSelectDiscoveryClick: Function
};

const DiscoveriesTableComponent = ({
  discoveriesList,
  onHandleSelectDiscoveryClick
}: Props) => (
  <div>
    {discoveriesList && discoveriesList.length > 0 ? (
      <Paper>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="left">Discovery ID</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discoveriesList.map(discovery => (
              <TableRow key={uuid()}>
                <TableCell align="left">{discovery.id}</TableCell>
                <TableCell align="left">
                  {discovery.finished ? 'Finished' : 'In progress'}
                </TableCell>
                <TableCell component="th" scope="row" padding="checkbox">
                  <Button
                    id={`button_${discovery.id}`}
                    size="small"
                    disabled={!discovery.finished}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      onHandleSelectDiscoveryClick(discovery.id);
                    }}
                  >
                    Select
                  </Button>
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
