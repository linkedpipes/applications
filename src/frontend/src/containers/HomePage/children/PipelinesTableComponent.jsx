// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import { ETL_STATUS_MAP } from '@utils';
import uuid from 'uuid';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { VisualizerIcon } from '@components/';
import globalUtils from '@utils/global.utils';

type Props = {
  pipelineExecutionsList: Array<{
    status: { '@id'?: string, status?: string },
    started: number,
    finished: number,
    executionIri: string,
    selectedVisualiser: string,
    startedByUser: boolean,
    frequencyHours: number,
    scheduleOn: boolean
  }>,
  classes: Object,
  onHandleSelectPipelineExecutionClick: Function,
  onHandlePipelineExecutionRowDeleteClicked: Function
};

const styles = theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  cardGrid: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  cardContent: {
    flexGrow: 1,
    paddingRight: theme.spacing(4)
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
  }
});

const PipelinesTableComponent = ({
  onHandleSelectPipelineExecutionClick,
  onHandlePipelineExecutionRowDeleteClicked,
  pipelineExecutionsList,
  classes
}: Props) => (
  <React.Fragment>
    <main>
      <Paper className={classes.heroContent}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Pipeline executions
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph
          >
            Browse Pipeline execution sessions. Click `Choose` to configure,
            publish and share your Application using data extracted by this
            pipeline execution. If you setup automated LinkedData updater after publishing
            an application, you will see details on data refreshing time
            interval on that pipeline execution record.
          </Typography>
        </Container>
      </Paper>

      <Container className={classes.cardGrid} maxWidth="xl">
        <Grid container spacing={4}>
          {(pipelineExecutionsList === undefined ||
            pipelineExecutionsList.length === 0) && (
            <Typography component={'span'} variant="h6" gutterBottom>
              No discovery sessions available, start with creating new app to
              see sessions here...
            </Typography>
          )}
          {pipelineExecutionsList.map((pipelineExecutionItem, index) => (
            <Grid item key={uuid()} xs={12} sm={6} md={4} xl={3}>
              <Card className={classes.card}>
                <CardHeader
                  title={
                    <Typography variant="h6">
                      Pipeline execution session
                    </Typography>
                  }
                  subheader={
                    <React.Fragment>
                      <Typography
                        variant="subtitle2"
                        style={{ display: 'inline' }}
                      >
                        Started:
                      </Typography>{' '}
                      <Typography variant="body2" style={{ display: 'inline' }}>
                        {pipelineExecutionItem.started !== '-1'
                          ? moment
                              .unix(pipelineExecutionItem.started)
                              .format('lll')
                          : 'N/A'}
                      </Typography>
                      <br />
                      <Typography
                        variant="subtitle2"
                        style={{ display: 'inline' }}
                      >
                        Finished:
                      </Typography>{' '}
                      <Typography variant="body2" style={{ display: 'inline' }}>
                        {pipelineExecutionItem.finished !== '-1'
                          ? moment
                              .unix(pipelineExecutionItem.started)
                              .format('lll')
                          : 'Not finished yet...'}
                      </Typography>
                    </React.Fragment>
                  }
                  action={
                    <IconButton
                      id={`delete_execution_session_button_${index}`}
                      key={`button_pipeline_${uuid.v4()}`}
                      aria-label="Decline"
                      onClick={() =>
                        onHandlePipelineExecutionRowDeleteClicked(
                          pipelineExecutionItem
                        )
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                />

                <div className={classes.cardMedia}>
                  <VisualizerIcon
                    visualizerType={pipelineExecutionItem.selectedVisualiser}
                    style={{ color: 'white', fontSize: '75px' }}
                  />
                </div>

                <CardContent className={classes.cardContent}>
                  <Typography variant="subtitle2" style={{ display: 'inline' }}>
                    Executed by:
                  </Typography>{' '}
                  <Typography
                    variant="body2"
                    style={{ display: 'inline-block' }}
                  >
                    {pipelineExecutionItem.startedByUser
                      ? 'User'
                      : 'Automated LinkedData sources updater'}
                  </Typography>
                  <br />
                  <Typography variant="subtitle2" style={{ display: 'inline' }}>
                    Execution based on:
                  </Typography>{' '}
                  <Typography
                    variant="body2"
                    style={{ display: 'inline-block' }}
                  >
                    {`${globalUtils.getBeautifiedVisualizerTitle(
                      pipelineExecutionItem.selectedVisualiser
                    )} visualizer`}
                  </Typography>
                  <br />
                  {pipelineExecutionItem.frequencyHours !== -1 && (
                    <React.Fragment>
                      <Typography
                        variant="subtitle2"
                        style={{ display: 'inline' }}
                      >
                        Auto-updates provided LinkedData sources every:
                      </Typography>{' '}
                      <Typography variant="body2">
                        {`${pipelineExecutionItem.frequencyHours}`}
                      </Typography>
                    </React.Fragment>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      onHandleSelectPipelineExecutionClick(
                        pipelineExecutionItem
                      );
                    }}
                    disabled={
                      !(
                        pipelineExecutionItem.status &&
                        ETL_STATUS_MAP[pipelineExecutionItem.status['@id']] ===
                          'Finished'
                      )
                    }
                    variant="contained"
                    color="secondary"
                  >
                    Choose
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
    <Paper className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        What is Pipeline Execution?
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Feeling confused and want to learn more about how Pipelines, Pipeline
        Executions and how we parse your LinkedData sources into a format
        recognized by visualizers that you selected ?
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Refer to ETL section in Docs.
      </Typography>
    </Paper>
    {/* End footer */}
  </React.Fragment>
);

export default withStyles(styles)(PipelinesTableComponent);
