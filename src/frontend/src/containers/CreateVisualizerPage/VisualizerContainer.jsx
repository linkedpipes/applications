import { connect } from 'react-redux';
import VisualizerComponent from './VisualizerComponent';

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer
  };
};

const VisualizerContainer = connect(mapStateToProps)(VisualizerComponent);

export default VisualizerContainer;
