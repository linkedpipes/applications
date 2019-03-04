import { connect } from 'react-redux';
import VisualizerComponent from './VisualizerComponent';

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    filters: state.visualizers.filters
  };
};

const VisualizerContainer = connect(mapStateToProps)(VisualizerComponent);

export default VisualizerContainer;
