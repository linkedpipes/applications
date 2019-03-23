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

type Props = {
  classes: {
    root: {},
    paper: {},
    button: {},
    templatesBtn: {},
    createBtn: {}
  },
  discoveriesList: Array<{}>,
  applicationsList: Array<{}>
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

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  render() {
    const { classes, discoveriesList, applicationsList } = this.props;
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
                Or try one of predefined examples
              </Typography>
              <Link
                style={{ textDecoration: 'none', color: 'transparent' }}
                to="/discover"
              >
                <Button
                  variant="contained"
                  size="large"
                  className={classes.templatesBtn}
                >
                  Treemap
                </Button>
              </Link>
              <Link
                style={{ textDecoration: 'none', color: 'transparent' }}
                to="/discover"
              >
                <Button
                  variant="contained"
                  size="large"
                  className={classes.templatesBtn}
                >
                  Google Maps
                </Button>
              </Link>
              <Link
                style={{ textDecoration: 'none', color: 'transparent' }}
                to="/discover"
              >
                <Button
                  variant="contained"
                  size="large"
                  className={classes.templatesBtn}
                >
                  Chord Diagram
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <AppBar position="static" color="secondary">
              <Tabs value={tabIndex} onChange={this.handleChange} centered>
                <Tab label="Discoveries" />
                <Tab label="My Applications" />
              </Tabs>
            </AppBar>
            {tabIndex === 0 && (
              <DiscoveriesTableComponent discoveriesList={[]} />
            )}
            {tabIndex === 1 && (
              <ApplicationsTableComponent applicationsList={[]} />
            )}
            {/* {1 === 0 && <div>Item One</div>}
        {2 === 1 && <div>Item Two</div>} */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomeComponent);
