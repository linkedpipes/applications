import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { LinearLoader } from '@components';
import { withStyles } from '@material-ui/core';

const styles = () => ({
  card: {
    flexGrow: 1
  },
  loader: {
    width: '80%'
  }
});

const DiscoverPipelinesExecutorComponent = ({
  classes,
  etlExecutionIsFinished,
  loaderLabelText
}) => (
  <Card className={classes.card}>
    <CardContent>
      <LinearLoader
        className={classes.loader}
        variant={'query'}
        labelText={loaderLabelText}
      />
    </CardContent>
  </Card>
);

export default withStyles(styles)(DiscoverPipelinesExecutorComponent);
