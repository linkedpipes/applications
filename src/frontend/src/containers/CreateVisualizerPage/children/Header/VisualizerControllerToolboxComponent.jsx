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
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  checkedPublished?: boolean,
  classes: { button: {}, leftIcon: {}, root: {} },
  handlePublishClicked: Function
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

const VisualizerControllerToolboxComponent = ({
  classes,
  checkedPublished,
  handlePublishClicked
}: Props) => (
  <div>
    <FormControlLabel
      control={<Switch value="checkedPublished" />}
      label={checkedPublished ? 'Unpublished' : 'Published'}
    />
    <Button
      variant="contained"
      color="default"
      className={classes.button}
      onClick={handlePublishClicked}
    >
      <CloudUploadIcon className={classes.leftIcon} />
      Get public link
    </Button>
    <Button variant="contained" color="default" className={classes.button}>
      <PreviewIcon className={classes.leftIcon} />
      Get embed link
    </Button>
  </div>
);

export default withStyles(styles)(VisualizerControllerToolboxComponent);
