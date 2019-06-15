// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: '#B2DFDB'
  },
  barColorPrimary: {
    backgroundColor: '#00695C'
  }
};

type Props = {
  classes: Object,
  labelText: string,
  variant: string
};

const LinearLoaderComponent = ({
  classes,
  labelText,
  variant = 'indeterminate'
}: Props) => (
  <div className={classes.root}>
    <Typography align="center" gutterBottom>
      {labelText}
    </Typography>
    <LinearProgress variant={variant} />
  </div>
);

export default withStyles(styles)(LinearLoaderComponent);
