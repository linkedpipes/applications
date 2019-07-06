// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import DiscoverVisualizerCard from './children';
import Emoji from 'react-emoji-render';
import uuid from 'uuid';
import { Container } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
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
  label: {
    marginTop: 5,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto'
  }
});

type Props = {
  classes: Object,
  visualizers: []
};

const DiscoverVisualizerPickerComponent = ({ classes, visualizers }: Props) => (
  <Container className={classes.cardGrid} maxWidth="md">
    <Grid container className={classes.root} spacing={4}>
      <Grid container className={classes.demo} justify="center" spacing={4}>
        {visualizers.length === 0 ? (
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Typography
                className={classes.label}
                variant="body2"
                align="center"
                gutterBottom
              >
                <Emoji text="No visualizers available, try providing different input ☹️" />
              </Typography>
            </Card>
          </Grid>
        ) : (
          visualizers.map((value, index) => (
            <Grid key={uuid()} item sm={6} md={4} lg={3}>
              <DiscoverVisualizerCard
                cardIndex={index}
                visualizerData={value}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  </Container>
);

export default withStyles(styles)(DiscoverVisualizerPickerComponent);
