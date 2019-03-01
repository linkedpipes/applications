import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MapIcon from '@material-ui/icons/Map';

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
    <CardActionArea style={{ textAlign: 'center' }}>
      <MapIcon style={{ fontSize: '80px' }} />
      <CardContent className={classes.CardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          Test
        </Typography>
        <Typography component="p">{visualizerData.visualizer.label}</Typography>
      </CardContent>
    </CardActionArea>
    <CardActions classes={{ root: classes.root }}>
      <Button size="small" color="primary" onClick={handleSelectVisualizer}>
        Select Vizualizer
      </Button>
    </CardActions>
  </Card>
);

DiscoverVisualizerCardComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSelectVisualizer: PropTypes.any,
  visualizerData: PropTypes.any
};

export default withStyles(styles)(DiscoverVisualizerCardComponent);
