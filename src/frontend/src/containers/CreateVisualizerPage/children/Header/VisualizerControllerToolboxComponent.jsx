import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PreviewIcon from '@material-ui/icons/Wallpaper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
  handleChange,
  checkedRefresh
}) => (
  <div>
    <FormControlLabel
      control={<Switch checked={checkedRefresh} value="checkedRefresh" />}
      label={checkedRefresh ? 'Refresh' : 'Fixed'}
    />
    <Button variant="contained" color="default" className={classes.button}>
      <CloudUploadIcon className={classes.leftIcon} />
      Publish
    </Button>
    <Button variant="contained" color="default" className={classes.button}>
      <PreviewIcon className={classes.leftIcon} />
      Embed
    </Button>
    <Button variant="contained" color="default" className={classes.button}>
      <KeyboardArrowDownIcon className={classes.leftIcon} />
      More
    </Button>
  </div>
);

VisualizerControllerToolboxComponent.propTypes = {
  checkedRefresh: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(VisualizerControllerToolboxComponent);
