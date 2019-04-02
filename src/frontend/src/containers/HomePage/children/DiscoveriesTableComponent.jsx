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
import { unixTimeConverter } from '@utils/';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';

type Props = {
  classes: Object,
  discoveriesList: Array<{
    id: string,
    finished: boolean,
    namedGraph: string,
    start: number,
    stop: number
  }>,
  onHandleSelectDiscoveryClick: Function,
  onHandleDiscoveryRowClicked: Function
};

const styles = () => ({
  root: {
    overflowX: 'auto'
  }
});

const DiscoveriesTableComponent = ({
  discoveriesList,
  onHandleSelectDiscoveryClick,
  onHandleDiscoveryRowClicked,
  classes
}: Props) => (
  <div>
    {discoveriesList && discoveriesList.length > 0 ? (
      <Paper classes={classes}>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Info</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Named Graph IRI</TableCell>
              <TableCell align="center">Started at</TableCell>
              <TableCell align="center">Finished at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discoveriesList.map(discovery => (
              <TableRow key={uuid()}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
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
                    Continue
                  </Button>
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
                  <Button
                    id={`button_${discovery.id}`}
                    size="small"
                    disabled={!discovery.finished}
                    variant="contained"
                    color="primary"
                    onClick={() => onHandleDiscoveryRowClicked(discovery)}
                  >
                    Info
                  </Button>
                </TableCell>

                <TableCell align="center">
                  {discovery.finished ? 'Finished' : 'In progress'}
                </TableCell>
                <TableCell align="center">{discovery.namedGraph}</TableCell>
                <TableCell align="center">
                  {unixTimeConverter(discovery.start)}
                </TableCell>
                <TableCell align="center">
                  {unixTimeConverter(discovery.stop)}
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

export default withStyles(styles)(DiscoveriesTableComponent);
