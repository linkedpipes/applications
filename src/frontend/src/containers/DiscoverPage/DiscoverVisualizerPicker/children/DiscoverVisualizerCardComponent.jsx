// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { VisualizerIcon } from '@components';
import { GlobalUtils } from '@utils';

type Props = {
  cardIndex: number,
  classes: { CardContent: {}, card: {} },
  handleSelectVisualizer: Function,
  visualizerData: {
    visualizer: { visualizerCode: string, label: string }
  }
};

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

const DiscoverVisualizerCardComponent = ({
  classes,
  visualizerData,
  handleSelectVisualizer,
  cardIndex
}: Props) => {
  return (
    <Card className={classes.card}>
      <CardActionArea
        style={{ textAlign: 'center' }}
        onClick={() => {
          handleSelectVisualizer();
        }}
        id={`visualizer-${cardIndex}-card`}
      >
        <VisualizerIcon
          visualizerType={visualizerData.visualizer.visualizerCode}
          style={{ color: 'white', fontSize: '75px' }}
        />
        <CardContent className={classes.CardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {GlobalUtils.getBeautifiedVisualizerTitle(
              visualizerData.visualizer.visualizerCode
            )}
          </Typography>
          <Typography component="p">
            {visualizerData.visualizer.label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withStyles(styles)(DiscoverVisualizerCardComponent);
