import { connect } from 'react-redux';
import DiscoverVisualizerPickerComponent from './DiscoverVisualizerPickerComponent';

const mapStateToProps = state => {
  return {
    visualizers: state.visualizers
  };
};

const DiscoverVisualizerPickerContainer = connect(mapStateToProps)(
  DiscoverVisualizerPickerComponent
);

export default DiscoverVisualizerPickerContainer;
