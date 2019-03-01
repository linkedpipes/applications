import { connect } from 'react-redux';
import DiscoverComponent from './DiscoverComponent';
import { discoverActions } from './duck';

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));
  const onBackClicked = () => dispatch(discoverActions.decrementActiveStep(1));
  const onResetClicked = () => dispatch(discoverActions.resetActiveStep());

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
