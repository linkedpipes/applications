import DiscoverInputSourcesComponent from './DiscoverInputSourcesComponent';
import { discoverOperations } from '../duck';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = value =>
    dispatch(discoverOperations.setSelectedInputExample(value));
  const onNextClicked = () =>
    dispatch(discoverOperations.incrementActiveStep(1));

  return {
    onInputExampleClicked,
    onNextClicked
  };
};

const mapStateToProps = state => {
  return {
    selectedInputExample: state.discover.selectedInputExample,
    activeStep: state.discover.activeStep
  };
};

const DiscoverInputSourcesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverInputSourcesComponent);

export default DiscoverInputSourcesContainer;
