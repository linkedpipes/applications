import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { VisualizerIcon } from '@components';
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

const DiscoverVisualizerCardComponent = ({
  classes,
  visualizerData,
  handleSelectVisualizer
}) => (
  <Card className={classes.card}>
    <CardActionArea
      style={{ textAlign: 'center' }}
      onClick={handleSelectVisualizer}
    >
      <VisualizerIcon
        visualizerType={visualizerData.visualizer.visualizerCode}
        style={{ color: 'white', fontSize: '75px' }}
      />
      <CardContent className={classes.CardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {getBeautifiedVisualizerTitle(
            visualizerData.visualizer.visualizerCode
          )}
        </Typography>
        <Typography component="p">{visualizerData.visualizer.label}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

DiscoverVisualizerCardComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSelectVisualizer: PropTypes.any,
  visualizerData: PropTypes.any
};

export default withStyles(styles)(DiscoverVisualizerCardComponent);
