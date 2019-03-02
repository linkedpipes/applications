import { connect } from 'react-redux';
import VisualizerComponent from './VisualizerComponent';
import { discoverOperations } from './duck';

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  // const onNextClicked = () =>
  //   dispatch(discoverOperations.incrementActiveStep(1));

  return {};
};

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer
  };
};

const VisualizerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizerComponent);

export default VisualizerContainer;
