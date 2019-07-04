// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import Container from '@material-ui/core/Container';
import uuid from 'uuid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
// eslint-disable-next-line no-unused-vars
import { VisualizerIcon } from '@components/';
import { CardHeader } from '@material-ui/core';
import moment from 'moment';

type Props = {
  classes: Object,
  discoveriesList: Array<{
    discoveryId: string,
    isFinished: boolean,
    sparqlEndpointIri: string,
    dataSampleIri: string,
    started: number,
    finished: number
  }>,
  onHandleSelectDiscoveryClick: Function,
  onHandleDiscoveryRowClicked: Function,
  onHandleDiscoveryRowDeleteClicked: Function
};

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
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
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
  }
});

const DiscoveriesTableComponent = ({
  discoveriesList,
  onHandleSelectDiscoveryClick,
  onHandleDiscoveryRowClicked,
  onHandleDiscoveryRowDeleteClicked,
  classes
}: Props) => (
  <React.Fragment>
    <main>
      <Paper className={classes.heroContent}>
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Discoveries
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph
          >
            Browse created Discovery sessions. Click `Continue` button to resume
            creating your applicaiton. Click `Detailed info` to see all
            information about session data sources that you provided during
            first step in application data preparation flow.
          </Typography>
        </Container>
      </Paper>

      <Container className={classes.cardGrid} maxWidth="xl">
        <Grid container spacing={4}>
          {(discoveriesList === undefined || discoveriesList.length === 0) && (
            <Typography component={'span'} variant="h6" gutterBottom>
              No discovery sessions available, start with creating new app to
              see sessions here...
            </Typography>
          )}
          {discoveriesList.map((discoveryItem, index) => (
            <Grid item key={uuid()} xs={12} sm={6} md={4} xl={3}>
              <Card className={classes.card}>
                <CardHeader
                  title={
                    <Typography variant="h6">Discovery session</Typography>
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
                        {moment.unix(discoveryItem.started).format('lll')}
                      </Typography>
                      <br />
                      <Typography
                        variant="subtitle2"
                        style={{ display: 'inline' }}
                      >
                        Finished:
                      </Typography>{' '}
                      <Typography variant="body2" style={{ display: 'inline' }}>
                        {discoveryItem.isFinished
                          ? moment.unix(discoveryItem.started).format('lll')
                          : 'Not finished yet...'}
                      </Typography>
                    </React.Fragment>
                  }
                  action={
                    <IconButton
                      id={`delete_discovery_session_button_${index}`}
                      key={`button_${discoveryItem.discoveryId}`}
                      aria-label="Decline"
                      onClick={() =>
                        onHandleDiscoveryRowDeleteClicked(discoveryItem)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  }
                />

                <CardContent className={classes.cardContent}>
                  <Typography variant="subtitle2" style={{ display: 'inline' }}>
                    SPARQL IRI:
                  </Typography>{' '}
                  <Typography
                    variant="body2"
                    style={{ display: 'inline-block' }}
                  >
                    {discoveryItem.sparqlEndpointIri
                      ? discoveryItem.sparqlEndpointIri
                      : 'N/A'}
                  </Typography>
                  <br />
                  <Typography variant="subtitle2" style={{ display: 'inline' }}>
                    Data sample IRI:
                  </Typography>{' '}
                  <Typography variant="body2">
                    {discoveryItem.dataSampleIri
                      ? discoveryItem.dataSampleIri
                      : 'N/A'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    id={`button_${discoveryItem.discoveryId}`}
                    disabled={!discoveryItem.isFinished}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      onHandleSelectDiscoveryClick(discoveryItem.discoveryId);
                    }}
                  >
                    Continue
                  </Button>
                  <Button
                    id={`button_${discoveryItem.discoveryId}`}
                    disabled={!discoveryItem.isFinished}
                    variant="contained"
                    color="primary"
                    onClick={() => onHandleDiscoveryRowClicked(discoveryItem)}
                  >
                    Detailed info
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
        What is Discovery?
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Feeling confused and want to learn more about how Discovery works and
        processes your data sources ?
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Refer to Discovery section in Docs.
      </Typography>
    </Paper>
    {/* End footer */}
  </React.Fragment>
);

export default withStyles(styles)(DiscoveriesTableComponent);
