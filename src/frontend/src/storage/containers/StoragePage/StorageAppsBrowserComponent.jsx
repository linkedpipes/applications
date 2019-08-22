// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StorageAppsBrowserCardComponent from './children/StorageAppsBrowserCardComponent';
import Emoji from 'react-emoji-render';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';
import uuid from 'uuid';
import { Paper, Container, Link } from '@material-ui/core';
import { GlobalConstants } from '@constants/';

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
  applicationsMetadata: Array<ApplicationMetadata>,
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
              My Applications
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
            >
              Browse your collection of published applications, modify or share
              them with anyone across the web. Every published application is
              securely stored in a decentralized LinkedData storage. You have
              full control over your application and it&apos;s data!
            </Typography>
          </Container>
        </Paper>

        <Container className={classes.cardGrid} maxWidth="xl">
          {applicationsMetadata.length !== 0 ? (
            <Grid container spacing={4}>
              {applicationsMetadata.map((metadata, index) => (
                <Grid key={uuid.v4()} item xs={12} sm={6} md={4} xl={3}>
                  <StorageAppsBrowserCardComponent
                    key={uuid.v4()}
                    indexNumber={index}
                    applicationMetadata={metadata}
                    setApplicationLoaderStatus={setApplicationLoaderStatus}
                    onHandleApplicationDeleted={onHandleApplicationDeleted}
                    isShared={false}
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
              No applications published yet
              <Emoji text=" ☹️" />
            </Typography>
          )}
        </Container>
      </main>
      {/* Footer */}
      <Paper className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          How are my applications being stored?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          LinkedPipes Applications uses SOLID to store your published
          applications in decentralized way.
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          SOLID is a new exciting project by Tim Berners Lee, the inventor of
          World Wide Web. Applications.
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Refer&nbsp;
          <Link target="_blank" href={GlobalConstants.SOLID_INFO_URL}>
            here
          </Link>
          &nbsp;to learn more about SOLID project. Refer&nbsp;
          <Link
            target="_blank"
            href={GlobalConstants.CONFIGURING_APPLICATIONS_DOCUMENTATION_URL}
          >
            here
          </Link>
          &nbsp;to learn more about usage of SOLID within LinkedPipes
          Applications.
        </Typography>
      </Paper>
      {/* End footer */}
    </React.Fragment>
  );
}

export default withStyles(styles)(StorageAppsBrowserComponent);
