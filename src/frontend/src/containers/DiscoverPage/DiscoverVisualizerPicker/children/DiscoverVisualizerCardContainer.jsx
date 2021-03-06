// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { etlActions } from '@ducks/etlDuck';
import { discoverActions } from '../../duck';
import DiscoverVisualizerCardComponent from './DiscoverVisualizerCardComponent';
import { GoogleAnalyticsWrapper } from '@utils';

type Props = {
  cardIndex: number,
  visualizerData: Object,
  handleSetSelectedPipelineId: Function,
  onAddSelectedVisualizer: Function,
  onNextClicked: Function,
  setPipelineExecutorStep: Function
};

class DiscoverVisualizerPickerContainer extends PureComponent<Props> {
  disabled: boolean;

  addVisualizer = visualizerData => {
    const { onAddSelectedVisualizer } = this.props;
    return new Promise(resolve => {
      onAddSelectedVisualizer(visualizerData);
      resolve();
    });
  };

  changeDisabled = () => {
    this.disabled = true;
  };

  onSelectVisualizer = () => {
    if (this.disabled) return;

    GoogleAnalyticsWrapper.trackEvent({
      category: 'Discovery',
      action: 'Selected visualizer : step 2'
    });

    this.changeDisabled();

    const { visualizerData, onNextClicked } = this.props;

    const dataSourceGroups = visualizerData.dataSourceGroups;

    const self = this;

    self.addVisualizer(visualizerData).then(() => {
      if (dataSourceGroups.length === 1) {
        self.handleSelectPipeline(dataSourceGroups[0]);
      } else {
        onNextClicked();
      }
    });
  };

  handleSelectPipeline = datasourceAndPipelines => {
    const { handleSetSelectedPipelineId, setPipelineExecutorStep } = this.props;
    const pipelines = datasourceAndPipelines.pipelines;
    pipelines.sort((a, b) => a.minimalIteration < b.minimalIteration);
    const pipelineWithMinIterations = pipelines[0];
    const pipelineId = pipelineWithMinIterations.id;

    handleSetSelectedPipelineId(pipelineId);
    setPipelineExecutorStep();
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
  const setPipelineExecutorStep = () =>
    dispatch(discoverActions.setActiveStep(3));

  const handleSetSelectedPipelineId = pipelineId =>
    dispatch(etlActions.setPipelineIdAction(pipelineId));

  const onAddSelectedVisualizer = visualizerData =>
    dispatch(
      globalActions.addSelectedVisualizerAction({
        data: visualizerData
      })
    );

  return {
    onNextClicked,
    setPipelineExecutorStep,
    onAddSelectedVisualizer,
    handleSetSelectedPipelineId
  };
};

export default connect(
  null,
  mapDispatchToProps
)(DiscoverVisualizerPickerContainer);
