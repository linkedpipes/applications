// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Avatar from '@material-ui/core/Avatar';
import StorageIcon from '@material-ui/icons/StorageTwoTone';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { StorageAppsBrowserCardComponent } from './children';
import AppConfiguration from '@storage/models/AppConfiguration';
import Emoji from 'react-emoji-render';
import uuid from 'uuid';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    width: 'auto',
    height: 'auto'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit * 1.5,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: '95%',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 7,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    backgroundColor: theme.palette.darkPaper.main
  },
  avatar: {
    margin: theme.spacing.unit,
    width: 50,
    height: 50,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

type Props = {
  classes: {
    main: {},
    paper: {},
    avatar: {},
    form: {},
    gridList: {}
  },
  applicationsMetadata: Array<AppConfiguration>,
  onHandleApplicationDeleted: Function,
  setApplicationLoaderStatus: Function
};

function StorageAppsBrowserComponent(props: Props) {
  const {
    classes,
    applicationsMetadata,
    onHandleApplicationDeleted,
    setApplicationLoaderStatus
  } = props;

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <StorageIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          LPApps Storage
        </Typography>
        <form className={classes.form}>
          {applicationsMetadata.length !== 0 ? (
            <GridList
              spacing={1}
              padding={20}
              cellHeight={200}
              className={classes.gridList}
            >
              {applicationsMetadata.map(metadata => (
                <StorageAppsBrowserCardComponent
                  key={uuid.v4()}
                  applicationMetadata={metadata}
                  setApplicationLoaderStatus={setApplicationLoaderStatus}
                  onHandleApplicationDeleted={onHandleApplicationDeleted}
                />
              ))}
            </GridList>
          ) : (
            <Typography variant="body2" align="center" gutterBottom>
              <Emoji text="No applications published yet ☹️" />
            </Typography>
          )}
        </form>
      </Paper>
    </div>
  );
}

StorageAppsBrowserComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StorageAppsBrowserComponent);
