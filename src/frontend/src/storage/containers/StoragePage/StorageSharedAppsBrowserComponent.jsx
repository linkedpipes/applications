// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StorageAppsBrowserCardComponent from './children/StorageAppsBrowserCardComponent';
import Emoji from 'react-emoji-render';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';
import uuid from 'uuid';
import { Paper, Container } from '@material-ui/core';

const styles = theme => ({
  root: {
    minWidth: '920'
  },
  gridArea: {
    flexGrow: 1,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
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
    gridArea: {},
    heroContent: {},
    cardGrid: {},
    footer: {}
  },
  sharedApplicationsMetadata: Array<ApplicationMetadata>,
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
    <React.Fragment>
      <main>
        {/* Hero unit */}
        <Paper className={classes.heroContent}>
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Shared Applications
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
            >
              Browse the collection of published applications shared with you by
              other users of LinkedPipes Applications platform, collaborate,
              edit and share them with anyone across the web. Every published
              application is securely stored in a decentralized LinkedData
              storage. Please note, the access control to a shared application
              may be limited by the owner of the application.
            </Typography>
          </Container>
        </Paper>

        <Container className={classes.cardGrid} maxWidth="xl">
          {sharedApplicationsMetadata.length !== 0 ? (
            <Grid container spacing={4}>
              {sharedApplicationsMetadata.map((metadata, index) => (
                <Grid key={uuid.v4()} item xs={12} sm={6} md={4} xl={3}>
                  <StorageAppsBrowserCardComponent
                    key={uuid.v4()}
                    indexNumber={index}
                    applicationMetadata={metadata}
                    setApplicationLoaderStatus={setApplicationLoaderStatus}
                    onHandleApplicationDeleted={onHandleApplicationDeleted}
                    isShared
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="h5"
              align="center"
              style={{
                textAlign: 'center'
              }}
              gutterBottom
            >
              No applications shared with you yet
              <Emoji text=" ☹️" />
            </Typography>
          )}
        </Container>
      </main>
      {/* Footer */}
      <Paper className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          How can I let people to modify my application?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Refer here to learn more about sharing your applications with other
          platform users to collaborate.
        </Typography>
      </Paper>
      {/* End footer */}
    </React.Fragment>
  );
}

StorageSharedAppsBrowserComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StorageSharedAppsBrowserComponent);
