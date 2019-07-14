// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Paper, CardActionArea } from '@material-ui/core';
import { samples as quickStartSamples } from '../../DiscoverPage/DiscoverInputSources/DiscoverExamplesContainer';
import uuid from 'uuid';
import { VisualizerIcon } from '@components/';
import { GlobalUtils } from '@utils/';

const useStyles = makeStyles(theme => ({
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
}));

type Props = {
  onHandleSampleClick: Function
};

function QuickStartComponent({ onHandleSampleClick }: Props) {
  const classes = useStyles();
  const [executeScroll, scrollHtmlAttributes] = GlobalUtils.useScroll();

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
              Quick Start
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
            >
              Hop up on creating your own Applications based on LinkedData!
              Choose one of our pre-defined templates for supported visualizers
              or start by providing with your own data sources.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Link
                    style={{ textDecoration: 'none', color: 'transparent' }}
                    to="/create-application"
                  >
                    <Button variant="contained" color="primary">
                      Create Application
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button
                    onClick={executeScroll}
                    variant="outlined"
                    color="primary"
                  >
                    Browse templates
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </Paper>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid {...scrollHtmlAttributes} container spacing={4}>
            {quickStartSamples.map(sample => (
              <Grid item key={uuid()} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardActionArea onClick={onHandleSampleClick(sample)}>
                    <div
                      className={classes.cardMedia}
                      style={{
                        backgroundColor: sample.backgroundColor
                      }}
                    >
                      <VisualizerIcon
                        visualizerType={sample.type}
                        style={{ fontSize: '75px' }}
                      />
                    </div>
                  </CardActionArea>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {sample.label}
                    </Typography>
                    <Typography>{sample.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      id={`${sample.label
                        .replace(/ /g, '-')
                        .toLowerCase()}-home-button`}
                      color="primary"
                      onClick={onHandleSampleClick(sample)}
                    >
                      Choose
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Paper className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Any questions?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Check out the About section for guides, tutorials and documentation :)
        </Typography>
      </Paper>
      {/* End footer */}
    </React.Fragment>
  );
}

export const QuickStart = QuickStartComponent