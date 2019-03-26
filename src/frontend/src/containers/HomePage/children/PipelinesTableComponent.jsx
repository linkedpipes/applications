// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ETL_STATUS_MAP } from '@utils';
import uuid from 'uuid';

type Props = {
  pipelinesList: Array<{
    executionIri: string,
    selectedVisualiser: string,
    status: { '@id'?: string, status?: string },
    webId: string
  }>
};

const PipelinesTableComponent = ({ pipelinesList }: Props) => (
  <div>
    {(pipelinesList && pipelinesList.length) > 0 ? (
      <Paper>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="left"> Execution IRI </TableCell>
              <TableCell align="left"> Visualizer </TableCell>
              <TableCell align="left"> Status </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pipelinesList.map(pipeline => (
              <TableRow key={uuid()}>
                <TableCell align="left">{pipeline.executionIri}</TableCell>
                <TableCell align="left">
                  {pipeline.selectedVisualiser}
                </TableCell>
                <TableCell align="left">
                  {(pipeline.status &&
                    ETL_STATUS_MAP[pipeline.status['@id']]) ||
                    (pipeline.status && pipeline.status.status) ||
                    'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    ) : (
      <Paper>
        <Typography variant="body1" gutterBottom>
          No pipelines found
        </Typography>
      </Paper>
    )}
  </div>
);

export default PipelinesTableComponent;
