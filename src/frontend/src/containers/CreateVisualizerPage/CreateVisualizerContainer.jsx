import { connect } from 'react-redux';
import CreateVisualizerComponent from './CreateVisualizerComponent';

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    filters: state.visualizers.filters
  };
};

const CreateVisualizerContainer = connect(mapStateToProps)(
  CreateVisualizerComponent
);

export default CreateVisualizerContainer;
