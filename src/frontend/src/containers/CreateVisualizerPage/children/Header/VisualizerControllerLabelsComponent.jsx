// @flow
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';

type Props = {
  onTitleChange?: (event: {}) => void,
  title: string,
  classes: { root: {}, textField: {} }
};

const styles = {
  root: {
    flexGrow: 1
  },
  textField: {
    flexGrow: 1
  }
};

const VisualizerControllerLabelsComponent = (props: Props) => (
  <div className={props.classes.root}>
    <MapIcon style={{ fontSize: '70px' }} />
    <TextField
      label="App title"
      className={props.classes.textField}
      value={props.title}
      placeholder="Enter your app Title"
      margin="normal"
    />
  </div>
);

export default withStyles(styles)(VisualizerControllerLabelsComponent);
