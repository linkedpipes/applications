// @flow
import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DiscoveriesTableComponent from './children/DiscoveriesTableComponent';
import ApplicationsTableComponent from './children/ApplicationsTableComponent';
import PipelinesTableComponent from './children/PipelinesTableComponent';
import { Log, AuthenticationService } from '@utils';
import { samples } from '../DiscoverPage/DiscoverInputSources/DiscoverExamplesContainer';
import axios from 'axios';

type Props = {
  classes: {
    root: {},
    paper: {},
    button: {},
    templatesBtn: {},
    createBtn: {}
  },
  history: { push: any },
  webId: string,
  handleSetUserProfile: any,
  discoveriesList: Array<{ id: string, finished: boolean }>,
  applicationsList: Array<{}>,
  pipelinesList: Array<{
    executionIri: string,
    selectedVisualiser: string,
    status: { '@id'?: string, status?: string },
    webId: string
  }>,
  onInputExampleClicked: (sample: {}) => void
};

type State = {
  tabIndex: number
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '2rem',
    marginLeft: '10%',
    marginRight: '10%'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing.unit,
    width: '90%'
  },
  templatesBtn: {
    margin: theme.spacing.unit,
    width: '90%',
    backgroundColor: theme.palette.primary.dark,
    color: 'white'
  },
  createBtn: {
    margin: theme.spacing.unit,
    width: '90%',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    textDecoration: 'none'
  }
});

class HomeComponent extends React.PureComponent<Props, State> {
  state = {
    tabIndex: 0
  };

  componentDidMount() {
    const { webId, handleSetUserProfile } = this.props;
    AuthenticationService.getUserProfile(webId)
      .then(res => {
        Log.info(
          'Response from get user profile call:',
          'AuthenticationService'
        );
        Log.info(res, 'AuthenticationService');
        Log.info(res.data, 'AuthenticationService');

        return res.data;
      })
      .then(jsonResponse => {
        handleSetUserProfile(jsonResponse);
      })
      .catch(error => {
        Log.error(error, 'HomeContainer');
      });
  }

  componentWillUnmount() {}

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  handleSampleClick = sample => {
    return () => {
      if (sample.type === 'ttlFile') {
        axios
          .get(sample.fileUrl)
          .then(response => {
            const sampleWithUris = sample;
            sampleWithUris.dataSourcesUris = response.data;
            this.props.onInputExampleClicked(sampleWithUris);
          })
          .catch(error => {
            // handle error
            Log.error(error, 'DiscoverExamplesContainer');
          });
      } else {
        this.props.onInputExampleClicked(sample);
      }
      this.props.history.push('/discover');
    };
  };

  render() {
    const {
      classes,
      discoveriesList,
      applicationsList,
      pipelinesList
    } = this.props;
    const { tabIndex } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
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
                  variant="contained"
                  size="large"
                  className={classes.templatesBtn}
                  onClick={this.handleSampleClick(sample)}
                >
                  {sample.label}
                </Button>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <AppBar position="static" color="secondary">
              <Tabs value={tabIndex} onChange={this.handleChange} centered>
                <Tab label="Discoveries" />
                <Tab label="Pipelines" />
                <Tab label="My Applications" />
              </Tabs>
            </AppBar>
            {tabIndex === 0 && (
              <DiscoveriesTableComponent discoveriesList={discoveriesList} />
            )}
            {tabIndex === 1 && (
              <PipelinesTableComponent pipelinesList={pipelinesList} />
            )}
            {tabIndex === 2 && (
              <ApplicationsTableComponent applicationsList={applicationsList} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomeComponent);
