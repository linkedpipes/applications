// @flow
import React, { PureComponent } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  DiscoveriesTable,
  ApplicationsTable,
  PipelinesTable
} from './children';
import { samples } from '../DiscoverPage/DiscoverInputSources/DiscoverExamplesContainer';
import uuid from 'uuid';

type Props = {
  classes: {
    root: {},
    paper: {},
    button: {},
    templatesBtn: {},
    createBtn: {}
  },
  history: { push: any },
  discoveriesList: Array<{ id: string, finished: boolean }>,
  applicationsList: Array<any>,
  pipelinesList: Array<{
    executionIri: string,
    selectedVisualiser: string,
    status: { '@id'?: string, status?: string },
    webId: string
  }>,
  onHandleTabChange: Function,
  onHandleSelectDiscoveryClick: Function,
  onHandleSampleClick: Function,
  onHandleSelectPipelineExecutionClick: Function,
  tabIndex: Number,
  onHandleAppClicked: Function,
  onHandleShareAppClicked: Function,
  onSetApplicationLoaderStatus: Function,
  onHandlePipelineExecutionRowDeleteClicked: Function
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '2rem',
    marginLeft: '4%',
    marginRight: '4%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing(),
    width: '90%'
  },
  createBtn: {
    margin: theme.spacing(),
    width: '90%',
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
    textTransform: 'none'
  },
  templatesBtn: {
    margin: theme.spacing(),
    width: '90%',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    textDecoration: 'none'
  }
});

class HomeComponent extends PureComponent<Props> {
  render() {
    const {
      classes,
      discoveriesList,
      applicationsList,
      pipelinesList,
      onHandleTabChange,
      onHandleSampleClick,
      onHandleSelectDiscoveryClick,
      onHandleSelectPipelineExecutionClick,
      tabIndex,
      onHandleAppClicked,
      onHandleShareAppClicked,
      onSetApplicationLoaderStatus,
      onHandlePipelineExecutionRowDeleteClicked
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper elevation={2} className={classes.paper}>
              <Typography variant="subtitle1" gutterBottom>
                Create a new application
              </Typography>
              <Link
                style={{ textDecoration: 'none', color: 'transparent' }}
                to="/discover"
              >
                <Button
                  variant="contained"
                  size="large"
                  className={classes.createBtn}
                >
                  Create
                </Button>
              </Link>
              <br />
              <Typography variant="subtitle1" gutterBottom>
                Or try one of our predefined examples
              </Typography>
              {samples.map(sample => (
                <Button
                  key={uuid()}
                  id={`${sample.label
                    .replace(/ /g, '-')
                    .toLowerCase()}-home-button`}
                  variant="contained"
                  size="large"
                  className={classes.templatesBtn}
                  onClick={onHandleSampleClick(sample)}
                >
                  {sample.label}
                </Button>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <AppBar position="static" color="secondary">
              <Tabs value={tabIndex} onChange={onHandleTabChange} centered>
                <Tab id="discoveries_tab" label="Discoveries" />
                <Tab id="pipeline_executions_tab" label="Pipelines" />
                <Tab id="my_applications_tab" label="My Applications" />
              </Tabs>
            </AppBar>
            <div
              style={{
                textAlign: 'center'
              }}
            >
              {tabIndex === 0 && (
                <DiscoveriesTable
                  discoveriesList={discoveriesList}
                  onHandleSelectDiscoveryClick={onHandleSelectDiscoveryClick}
                  onSetApplicationLoaderStatus={onSetApplicationLoaderStatus}
                />
              )}
              {tabIndex === 1 && (
                <PipelinesTable
                  pipelinesList={pipelinesList}
                  onHandlePipelineExecutionRowDeleteClicked={
                    onHandlePipelineExecutionRowDeleteClicked
                  }
                  onHandleSelectPipelineExecutionClick={
                    onHandleSelectPipelineExecutionClick
                  }
                />
              )}
              {tabIndex === 2 && (
                <ApplicationsTable
                  applicationsList={applicationsList}
                  onHandleShareAppClicked={onHandleShareAppClicked}
                  onHandleAppClicked={onHandleAppClicked}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomeComponent);
