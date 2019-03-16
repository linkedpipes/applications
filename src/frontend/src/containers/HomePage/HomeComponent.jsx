// @flow
import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core/styles';
import Link from 'react-router-dom/es/Link';

type Props = {
  classes: {
    root: {},
    paper: {},
    button: {},
    templatesBtn: {},
    createBtn: {}
  }
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

const HomeComponent = ({ classes }: Props) => (
  <div className={classes.root}>
    <Grid container spacing={24}>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <Typography variant="subtitle1" gutterBottom>
            Start by creating a new application
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
          <Button
            variant="contained"
            size="large"
            className={classes.templatesBtn}
          >
            Templates
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <Typography variant="subtitle1" gutterBottom>
            Recent applications
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <Typography variant="subtitle1" gutterBottom>
            Running discoveries
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(HomeComponent);
