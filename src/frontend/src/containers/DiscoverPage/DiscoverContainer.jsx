import { connect } from 'react-redux';
import DiscoverComponent from './DiscoverComponent';
import { discoverActions } from './duck';
import { DiscoveryService, Log } from '@utils';
import lifecycle from 'react-pure-lifecycle';
import { discoveryActions } from '@ducks/discoveryDuck';

const componentDidMount = props => {
  const { location, handleSetPipelineGroups, onNextClicked, history } = props;
  if (location.state && location.state.discoveryId) {
    Log.info(`Just received ${location.state.discoveryId}`);
    const discoveryId = location.state.discoveryId;
    DiscoveryService.getPipelineGroups({ discoveryId })
      .then(response => {
        return response.data;
      })
      .then(jsonResponse => {
        handleSetPipelineGroups(jsonResponse.pipelineGroups);
        onNextClicked();
      });

    history.replace({
      pathname: location.pathname,
      state: undefined
    });
  }
};

const componentWillUnmount = props => {
  const { onResetClicked, onResetSelectedInput } = props;
  onResetClicked();
  onResetSelectedInput();
};

const methods = {
  componentDidMount,
  componentWillUnmount
};

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  const onBackClicked = () => dispatch(discoverActions.decrementActiveStep(1));
  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));
  const onResetClicked = () => dispatch(discoverActions.resetActiveStep());
  const onResetSelectedInput = () =>
    dispatch(discoverActions.resetSelectedInputExample());
  const handleSetPipelineGroups = pipelineGroups =>
    dispatch(discoveryActions.setPipelineGroupsAction(pipelineGroups));

  return {
    onBackClicked,
    onResetClicked,
    onResetSelectedInput,
    handleSetPipelineGroups,
    onNextClicked
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
