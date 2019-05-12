import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { discoverActions } from '../../duck';
import { Log } from '@utils';
import DiscoverVisualizerCardComponent from './DiscoverVisualizerCardComponent';
import GoogleAnalytics from 'react-ga'

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

    GoogleAnalytics.event({
      category: 'Discovery',
      action: 'Selected visualizer : step 2'
    });

    Log.info('Selected visualizer', 'DiscoverVisualizerPickerContainer');
    self.addVisualizer(visualizerData).then(() => {
      self.props.onNextClicked();
    });
  };

  render() {
    const { visualizerData, cardIndex } = this.props;
    return (
      <DiscoverVisualizerCardComponent
        visualizerData={visualizerData}
        cardIndex={cardIndex}
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
  cardIndex: PropTypes.any,
  visualizerData: PropTypes.any
};

export default connect(
  null,
  mapDispatchToProps
)(DiscoverVisualizerPickerContainer);
