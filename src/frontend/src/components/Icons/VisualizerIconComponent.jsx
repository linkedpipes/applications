import React from 'react';
import PropTypes from 'prop-types';
import { VISUALIZER_TYPE } from '@constants';
import MapIcon from '@material-ui/icons/MapTwoTone';
import TimelineIcon from '@material-ui/icons/TimelineTwoTone';
import DCTermsIcon from '@material-ui/icons/ShareTwoTone';
import UnkownIcon from '@material-ui/icons/WallpaperTwoTone';

const VisualizerIconComponent = ({ visualizerType, style }) => {
  switch (visualizerType) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.LABELED_POINTS_MAP:
      return <MapIcon style={style} />;

    case VISUALIZER_TYPE.LABELED_TIMELINE:
    case VISUALIZER_TYPE.TIMELINE:
    case VISUALIZER_TYPE.TIMELINE_PERIODS:
    case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
      return <TimelineIcon style={style} />;

    case VISUALIZER_TYPE.DCTERMS:
      return <DCTermsIcon style={style} />;

    default:
      return <UnkownIcon style={style} />;
  }
};

VisualizerIconComponent.propTypes = {
  style: PropTypes.any,
  visualizerType: PropTypes.any
};

export default VisualizerIconComponent;
