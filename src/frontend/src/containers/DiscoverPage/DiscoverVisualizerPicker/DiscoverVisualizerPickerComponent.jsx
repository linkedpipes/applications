// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import DiscoverVisualizerCard from './children';
import classNames from 'classnames';
import Emoji from 'react-emoji-render';
import uuid from 'uuid';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  },
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
  <div className={classNames(classes.layout, classes.cardGrid)}>
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
  </div>
);

export default withStyles(styles)(DiscoverVisualizerPickerComponent);
