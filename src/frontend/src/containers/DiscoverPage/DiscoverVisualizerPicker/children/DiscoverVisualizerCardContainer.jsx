import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { addSelectedVisualizerAction } from '../../../../_actions/globals';
import { discoverActions } from '../../duck';
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
    console.log('clicked');
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
      addSelectedVisualizerAction({
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
