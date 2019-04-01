// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PreviewIcon from '@material-ui/icons/Wallpaper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type Props = {
  checkedRefresh?: boolean,
  classes: { button: {}, leftIcon: {}, root: {} }
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const VisualizerControllerToolboxComponent = (props: Props) => (
  <div>
    <FormControlLabel
      control={<Switch value="checkedRefresh" />}
      label={props.checkedRefresh ? 'Refresh' : 'Fixed'}
    />
    <Button
      variant="contained"
      color="default"
      className={props.classes.button}
    >
      <CloudUploadIcon className={props.classes.leftIcon} />
      Publish
    </Button>
    <Button
      variant="contained"
      color="default"
      className={props.classes.button}
    >
      <PreviewIcon className={props.classes.leftIcon} />
      Embed
    </Button>
    <Button
      variant="contained"
      color="default"
      className={props.classes.button}
    >
      <KeyboardArrowDownIcon className={props.classes.leftIcon} />
      More
    </Button>
  </div>
);

export default withStyles(styles)(VisualizerControllerToolboxComponent);
