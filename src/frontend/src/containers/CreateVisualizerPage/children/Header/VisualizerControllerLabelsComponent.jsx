// @flow
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';

type Props = {
  classes: { root: {}, textField: {} },
  handleAppTitleChanged: Function
};

const styles = {
  root: {
    flexGrow: 1,
    display: 'inline-block',
    margin: 'auto'
  },
  textField: {
    flexGrow: 1
  }
};

const VisualizerControllerLabelsComponent = ({
  classes,
  handleAppTitleChanged
}: Props) => (
  <div className={classes.root}>
    <MapIcon style={{ fontSize: '70px' }} />
    <TextField
      label="App title"
      className={classes.textField}
      variant="outlined"
      placeholder="Enter your app Title"
      onChange={handleAppTitleChanged}
      margin="normal"
    />
  </div>
);

export default withStyles(styles)(VisualizerControllerLabelsComponent);
