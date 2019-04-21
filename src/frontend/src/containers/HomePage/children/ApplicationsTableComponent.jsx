// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid';
import { AppConfiguration } from '@storage';

type Props = {
  applicationsList: Array<AppConfiguration>
};

const ApplicationsTableComponent = ({ applicationsList }: Props) => (
  <div>
    {(applicationsList && applicationsList.length) > 0 ? (
      <Paper>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationsList.map(metadata => (
              <TableRow key={uuid()}>
                <TableCell component="th" scope="row">
                  {metadata.title}
                </TableCell>
                <TableCell align="center">{metadata.endpoint}</TableCell>
                <TableCell align="center">{`${metadata.createdAt}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    ) : (
      <Paper>
        <Typography variant="body1" gutterBottom>
          No applications found
        </Typography>
      </Paper>
    )}
  </div>
);

export default ApplicationsTableComponent;
