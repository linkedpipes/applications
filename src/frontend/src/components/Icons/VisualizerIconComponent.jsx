// @flow
import React from 'react';
import { VISUALIZER_TYPE } from '@constants';
import MapIcon from '@material-ui/icons/MapTwoTone';
import TimelineIcon from '@material-ui/icons/TimelineTwoTone';
import DCTermsIcon from '@material-ui/icons/ShareTwoTone';
import ChordIcon from '@material-ui/icons/BlurCircularTwoTone';
import TreemapIcon from '@material-ui/icons/TableChartTwoTone';
import UnkownIcon from '@material-ui/icons/WallpaperTwoTone';

type Props = {
  style: Object,
  visualizerType: string
};

const VisualizerIconComponent = ({ visualizerType, style }: Props) => {
  switch (visualizerType.toUpperCase()) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP:
      return <MapIcon style={style} />;

    case VISUALIZER_TYPE.LABELED_TIMELINE:
    case VISUALIZER_TYPE.TIMELINE:
    case VISUALIZER_TYPE.TIMELINE_PERIODS:
    case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
      return <TimelineIcon style={style} />;

    case VISUALIZER_TYPE.DCTERMS:
      return <DCTermsIcon style={style} />;

    case VISUALIZER_TYPE.TREEMAP:
      return <TreemapIcon style={style} />;

    case VISUALIZER_TYPE.CHORD:
      return <ChordIcon style={style} />;

    default:
      return <UnkownIcon style={style} />;
  }
};

export default VisualizerIconComponent;
