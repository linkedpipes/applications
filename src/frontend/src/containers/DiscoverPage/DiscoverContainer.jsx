import { connect } from 'react-redux';
import DiscoverComponent from './DiscoverComponent';
import { discoverActions } from './duck';
import lifecycle from 'react-pure-lifecycle';

const componentWillUnmount = props => {
  const { onResetClicked, onResetSelectedTab } = props;
  onResetClicked();
  onResetSelectedTab();
};

const methods = {
  componentWillUnmount
};

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  const onBackClicked = () => dispatch(discoverActions.decrementActiveStep(1));
  const onResetClicked = () => dispatch(discoverActions.resetActiveStep());
  const onResetSelectedTab = () =>
    dispatch(discoverActions.resetSelectedInputExample());

  return {
    onBackClicked,
    onResetClicked,
    onResetSelectedTab
  };
};

const mapStateToProps = state => {
  return {
    activeStep: state.discover.activeStep,
    etlExecutionStatus: state.discover.etlExecutionStatus
  };
};

const DiscoverContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(lifecycle(methods)(DiscoverComponent));

export default DiscoverContainer;
