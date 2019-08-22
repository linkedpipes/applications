// @flow
import React from 'react';
import MapIcon from '@material-ui/icons/MapTwoTone';
import TimelineIcon from '@material-ui/icons/TimelineTwoTone';
import DCTermsIcon from '@material-ui/icons/ShareTwoTone';
import ChordIcon from '@material-ui/icons/BlurCircularTwoTone';
import TreemapIcon from '@material-ui/icons/TableChartTwoTone';
import { withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/ErrorTwoTone';
import UnkownIcon from '@material-ui/icons/WallpaperTwoTone';
import { connect } from 'react-redux';
import { VISUALIZER_TYPE } from '@constants';

const styles = () => ({
  icon: {
    color: 'white'
  },
  iconDark: {
    color: 'black'
  }
});
type Props = {
  classes: { icon: {}, iconDark: {} },
  style: Object,
  visualizerType: string,
  colorThemeIsLight: boolean
};

const Icon = ({ visualizerType, style, classes, colorThemeIsLight }: Props) => {
  const iconClass = colorThemeIsLight ? classes.iconDark : classes.icon;

  switch (visualizerType.toUpperCase()) {
    case VISUALIZER_TYPE.MAP:
    case VISUALIZER_TYPE.MAP_WITH_MARKER_FILTERS:
      return <MapIcon className={iconClass} style={style} />;

    case VISUALIZER_TYPE.LABELED_TIMELINE:
    case VISUALIZER_TYPE.TIMELINE:
    case VISUALIZER_TYPE.TIMELINE_PERIODS:
    case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
      return <TimelineIcon className={iconClass} style={style} />;

    case VISUALIZER_TYPE.DCTERMS:
      return <DCTermsIcon className={iconClass} style={style} />;

    case VISUALIZER_TYPE.TREEMAP:
      return <TreemapIcon className={iconClass} style={style} />;

    case VISUALIZER_TYPE.CHORD:
      return <ChordIcon className={iconClass} style={style} />;

    case 'ERROR':
      return <ErrorIcon className={iconClass} style={style} />;

    default:
      return <UnkownIcon className={iconClass} style={style} />;
  }
};

const mapStateToProps = state => {
  return {
    colorThemeIsLight: state.user.colorThemeIsLight
  };
};

export const VisualizerIcon = withStyles(styles)(
  connect(mapStateToProps)(Icon)
);
