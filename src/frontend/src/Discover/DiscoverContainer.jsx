import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import DiscoverComponent from './DiscoverComponent';
import { discoverOperations } from './duck';

function getSteps() {
  return [
    'Add Data Source IRIs',
    'Pick a visualizer',
    'Pick a source for execution',
    'Preview & create app'
  ];
}

class DiscoverContainer extends PureComponent {
  render() {
    const steps = getSteps();
    const {
      discoveryId,
      selectedVisualizer,
      activeStep,
      onNextClicked,
      onBackClicked,
      onResetClicked
    } = this.props;

    return (
      <DiscoverComponent
        steps={steps}
        activeStep={activeStep}
        discoveryId={discoveryId}
        selectedVisualizer={selectedVisualizer}
        onNextClicked={onNextClicked}
        onBackClicked={onBackClicked}
        onResetClicked={onResetClicked}
      />
    );
  }
}

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
    discoveryId: state.globals.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    activeStep: state.discover.activeStep
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverContainer);
