import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { discoverActions } from '../../duck';
import { Log } from '@utils';
import DiscoverVisualizerCardComponent from './DiscoverVisualizerCardComponent';

class DiscoverVisualizerPickerContainer extends PureComponent {
  addVisualizer = visualizerData => {
    const self = this;
    return new Promise(resolve => {
      self.props.onAddSelectedVisualizer(visualizerData);
      resolve();
    });
  };

  onSelectVisualizer = () => {
    const self = this;
    const { visualizerData } = self.props;
    Log.info('Selected visualizer', 'DiscoverVisualizerPickerContainer');
    self.addVisualizer(visualizerData).then(() => {
      self.props.onNextClicked();
    });
  };

  render() {
    const { visualizerData } = this.props;
    return (
      <DiscoverVisualizerCardComponent
        visualizerData={visualizerData}
        handleSelectVisualizer={this.onSelectVisualizer}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));

  const onAddSelectedVisualizer = visualizerData =>
    dispatch(
      globalActions.addSelectedVisualizerAction({
        data: visualizerData
      })
    );

  return {
    onNextClicked,
    onAddSelectedVisualizer
  };
};

DiscoverVisualizerPickerContainer.propTypes = {
  visualizerData: PropTypes.any
};

export default connect(
  null,
  mapDispatchToProps
)(DiscoverVisualizerPickerContainer);