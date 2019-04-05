// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import StorageIcon from '@material-ui/icons/StorageTwoTone';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StorageAppsBrowserCardComponent from './children';
import Emoji from 'react-emoji-render';

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
  tileData: {}
};

function StorageAppsBrowserComponent(props: Props) {
  const { classes, tileData } = props;

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
          {Object.keys(tileData).length !== 0 ? (
            <GridList
              spacing={1}
              padding={20}
              cellHeight={200}
              className={classes.gridList}
            >
              {Object.keys(tileData).map((keyName, i) => (
                <StorageAppsBrowserCardComponent
                  singleTileData={tileData[keyName]}
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
