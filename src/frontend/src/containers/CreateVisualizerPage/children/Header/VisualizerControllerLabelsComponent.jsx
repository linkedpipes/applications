// @flow
import * as React from 'react';
import { withStyles, Typography, InputBase, Grid } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';

type Props = {
  classes: { root: {}, textField: {}, textFieldFontSize: {} },
  handleAppTitleChanged: Function
};

const styles = {
  root: {
    flexGrow: 1,
    display: 'inline-block',
    margin: 'auto'
  },
  textField: {
    flexGrow: 1,
    fontSize: 30
  }
};

const VisualizerControllerLabelsComponent = ({
  classes,
  handleAppTitleChanged
}: Props) => (
  <div className={classes.root}>
    <Grid container spacing={16}>
      <Grid item>
        <MapIcon style={{ fontSize: '70px' }} />
      </Grid>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={5}>
          <Grid xs>
            <InputBase
              label="App title"
              className={classes.textField}
              variant="outlined"
              placeholder="Enter your app title"
              onChange={handleAppTitleChanged}
              margin="normal"
            />
          </Grid>
          <Grid item>
            <Typography variant="title">Google Maps Visualizer</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(VisualizerControllerLabelsComponent);
