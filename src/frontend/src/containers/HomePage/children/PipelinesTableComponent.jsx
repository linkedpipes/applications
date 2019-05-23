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
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import { ETL_STATUS_MAP } from '@utils';
import uuid from 'uuid';
import moment from 'moment';

type Props = {
  pipelinesList: Array<{
    status: { '@id'?: string, status?: string },
    started: number,
    finished: number,
    executionIri: string,
    selectedVisualiser: string
  }>,
  classes: Object,
  onHandleSelectPipelineExecutionClick: Function,
  onHandlePipelineExecutionRowDeleteClicked: Function
};

const styles = () => ({
  root: {
    overflowX: 'auto'
  }
});

const PipelinesTableComponent = ({
  onHandleSelectPipelineExecutionClick,
  onHandlePipelineExecutionRowDeleteClicked,
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
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pipelinesList.map((pipeline, index) => (
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
                <TableCell align="center">
                  {pipeline.executionIri
                    ? pipeline.executionIri.split('/executions/')[1]
                    : 'N/A'}
                </TableCell>
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
                  {pipeline.started === -1
                    ? 'N/A'
                    : moment.unix(pipeline.started).format('lll')}
                </TableCell>
                <TableCell align="center">
                  {pipeline.finished === -1
                    ? 'N/A'
                    : moment.unix(pipeline.finished).format('lll')}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
                  <IconButton
                    id={`delete_execution_session_button_${index}`}
                    key={`button_pipeline_${uuid.v4()}`}
                    aria-label="Decline"
                    onClick={() =>
                      onHandlePipelineExecutionRowDeleteClicked(pipeline)
                    }
                    disabled={
                      !(
                        pipeline.status &&
                        ETL_STATUS_MAP[pipeline.status['@id']] === 'Finished'
                      )
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
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
