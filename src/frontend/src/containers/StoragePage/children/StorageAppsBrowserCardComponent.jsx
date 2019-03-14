// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { VisualizerIcon } from '@components';
import { VISUALIZER_TYPE } from '@constants';
import { getBeautifiedVisualizerTitle } from '@utils';

const styles = {
  root: {
    justifyContent: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1
  },
  media: {
    objectFit: 'cover'
  }
};

type Props = {
  classes: {
    root: {},
    card: {},
    cardContent: {},
    media: {}
  }
};

const StorageAppsBrowserCardComponent = ({ classes }: Props) => {
  return (
    <Card className={classes.card}>
      <CardActionArea style={{ textAlign: 'center' }}>
        <VisualizerIcon
          visualizerType={VISUALIZER_TYPE.MAP}
          style={{ color: 'white', fontSize: '75px' }}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            Test
          </Typography>
          <Typography component="p">Test</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions classes={{ root: classes.root }}>
        <Button size="small" color="primary">
          Select App
        </Button>
      </CardActions>
    </Card>
  );
};

export default withStyles(styles)(StorageAppsBrowserCardComponent);
