// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { StorageAppsBrowserCardComponent } from './children';
import AppConfiguration from '@storage/models/AppConfiguration';
import Emoji from 'react-emoji-render';

const styles = () => ({
  root: {
    minWidth: '920'
  },
  gridArea: {
    flexGrow: 1,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5
  }
});

type Props = {
  classes: {
    main: {},
    paper: {},
    avatar: {},
    form: {},
    gridList: {},
    root: {},
    gridArea: {}
  },
  sharedApplicationsMetadata: Array<AppConfiguration>,
  onHandleApplicationDeleted: Function,
  setApplicationLoaderStatus: Function
};

function StorageSharedAppsBrowserComponent(props: Props) {
  const {
    classes,
    sharedApplicationsMetadata,
    onHandleApplicationDeleted,
    setApplicationLoaderStatus
  } = props;

  return (
    <div className={classes.root}>
      {sharedApplicationsMetadata.length !== 0 ? (
        <div className={classes.gridArea}>
          <Grid container spacing={8}>
            {sharedApplicationsMetadata.map((metadata, index) => (
              <Grid
                key={metadata.createdAt}
                item
                xs={3}
                sm={3}
                md={3}
                lg={2}
                xl={2}
              >
                <StorageAppsBrowserCardComponent
                  indexNumber={index}
                  applicationMetadata={metadata}
                  setApplicationLoaderStatus={setApplicationLoaderStatus}
                  onHandleApplicationDeleted={onHandleApplicationDeleted}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Typography
          variant="h5"
          align="center"
          style={{
            textAlign: 'center'
          }}
          gutterBottom
        >
          No applications published yet
          <Emoji text=" ☹️" />
        </Typography>
      )}
    </div>
  );
}

StorageSharedAppsBrowserComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StorageSharedAppsBrowserComponent);
