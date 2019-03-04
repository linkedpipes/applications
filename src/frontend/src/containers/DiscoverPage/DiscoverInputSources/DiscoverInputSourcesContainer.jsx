import DiscoverInputSourcesComponent from './DiscoverInputSourcesComponent';
import { discoverActions } from '../duck';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = sample =>
    dispatch(discoverActions.setSelectedInputExample(sample));
  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));

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
