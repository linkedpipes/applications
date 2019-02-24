import { connect } from 'react-redux';
import DiscoverComponent from './DiscoverComponent';
import { discoverOperations } from './duck';

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  const onNextClicked = () =>
    dispatch(discoverOperations.incrementActiveStep(1));
  const onBackClicked = () =>
    dispatch(discoverOperations.decrementActiveStep(1));
  const onResetClicked = () => dispatch(discoverOperations.resetActiveStep());

  return {
    onNextClicked,
    onBackClicked,
    onResetClicked
  };
};

const mapStateToProps = state => {
  return {
    activeStep: state.discover.activeStep
  };
};

const DiscoverContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverComponent);

export default DiscoverContainer;
