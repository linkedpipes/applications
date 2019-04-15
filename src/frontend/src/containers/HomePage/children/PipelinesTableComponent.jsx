// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ETL_STATUS_MAP, unixTimeConverter } from '@utils';
import uuid from 'uuid';

type Props = {
  pipelinesList: Array<{
    status: { '@id'?: string, status?: string },
    started: number,
    finished: number,
    executionIri: string,
    selectedVisualiser: string
  }>,
  classes: Object,
  onHandleSelectPipelineExecutionClick: Function
};

const styles = () => ({
  root: {
    overflowX: 'auto'
  }
});

const PipelinesTableComponent = ({
  onHandleSelectPipelineExecutionClick,
  pipelinesList,
  classes
}: Props) => (
  <div>
    {(pipelinesList && pipelinesList.length) > 0 ? (
      <Paper classes={classes}>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Execution IRI</TableCell>
              <TableCell align="center">Visualizer Type</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Started at</TableCell>
              <TableCell align="center">Finished at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pipelinesList.map(pipeline => (
              <TableRow key={uuid()}>
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() => {
                      onHandleSelectPipelineExecutionClick(pipeline);
                    }}
                    disabled={
                      !(
                        pipeline.status &&
                        ETL_STATUS_MAP[pipeline.status['@id']] === 'Finished'
                      )
                    }
                    variant="contained"
                    color="secondary"
                  >
                    Create App
                  </Button>
                </TableCell>
                <TableCell align="center">{pipeline.executionIri}</TableCell>
                <TableCell align="center">
                  {pipeline.selectedVisualiser}
                </TableCell>
                <TableCell align="center">
                  {(pipeline.status &&
                    ETL_STATUS_MAP[pipeline.status['@id']]) ||
                    (pipeline.status && pipeline.status.status) ||
                    'N/A'}
                </TableCell>
                <TableCell align="center">
                  {unixTimeConverter(pipeline.started)}
                </TableCell>
                <TableCell align="center">
                  {unixTimeConverter(pipeline.finished)}
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

export default withStyles(styles)(PipelinesTableComponent);
