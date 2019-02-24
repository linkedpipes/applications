import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DiscoverVisualizerPickerComponent from './DiscoverVisualizerPickerComponent';
import { addSelectedVisualizerAction } from '../../_actions/globals';

class DiscoverVisualizerPickerContainer extends PureComponent {
  addSelectedVisualizer = visualizerData => {
    const self = this;

    return new Promise(resolve => {
      self.props.dispatch(
        addSelectedVisualizerAction({
          data: visualizerData
        })
      );
      resolve();
    });
  };

  handleSelectVisualizer = () => {
    const self = this;
    const visualizerData = self.props.visualizerData;

    self.addSelectedVisualizer(visualizerData).then(() => {
      self.props.handleNextStep();
    });
  };

  render() {
    const { visualizers, hasOneVisualizer, discoveryId } = this.props;
    return (
      <DiscoverVisualizerPickerComponent
        visualizers={visualizers}
        hasOneVisualizer={hasOneVisualizer}
        discoveryId={discoveryId}
        onSelectVisualizer={this.handleSelectVisualizer}
      />
    );
  }
}

DiscoverVisualizerPickerContainer.propTypes = {
  discoveryId: PropTypes.any,
  hasOneVisualizer: PropTypes.any,
  visualizers: PropTypes.any
};

const mapStateToProps = state => {
  return {
    visualizers: state.visualizers,
    hasOneVisualizer: state.visualizers.length === 1,
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(DiscoverVisualizerPickerContainer);
