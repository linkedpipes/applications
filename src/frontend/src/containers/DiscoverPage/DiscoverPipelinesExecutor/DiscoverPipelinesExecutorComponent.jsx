// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import { LinearLoader } from '@components';
import { ETL_STATUS_TYPE } from '@utils';

const styles = () => ({
  card: {
    flexGrow: 1
  },
  loader: {
    width: '80%'
  }
});

type Props = {
  classes: any,
  etlExecutionIsFinished: string,
  loaderLabelText: any
};

const DiscoverPipelinesExecutorComponent = ({
  classes,
  etlExecutionIsFinished,
  loaderLabelText
}: Props) => (
  <Card className={classes.card}>
    <CardContent>
      {etlExecutionIsFinished === ETL_STATUS_TYPE.Finished ||
      etlExecutionIsFinished === ETL_STATUS_TYPE.Cancelled ||
      etlExecutionIsFinished === ETL_STATUS_TYPE.Unknown ||
      etlExecutionIsFinished === ETL_STATUS_TYPE.Failed ? (
        <LinearLoader
          className={classes.loader}
          variant={'buffer'}
          value={100}
          valueBuffer={100}
          labelText={loaderLabelText}
        />
      ) : (
        <LinearLoader className={classes.loader} labelText={loaderLabelText} />
      )}
    </CardContent>
  </Card>
);

export default withStyles(styles)(DiscoverPipelinesExecutorComponent);
