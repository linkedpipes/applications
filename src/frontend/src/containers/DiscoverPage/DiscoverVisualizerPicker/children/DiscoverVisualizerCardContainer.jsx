// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { etlActions } from '@ducks/etlDuck';
import { discoverActions } from '../../duck';
import { Log } from '@utils';
import DiscoverVisualizerCardComponent from './DiscoverVisualizerCardComponent';
import { toast } from 'react-toastify';

type Props = {
  cardIndex: number,
  visualizerData: Object,
  handleSetSelectedPipelineId: Function,
  onAddSelectedVisualizer: Function,
  dataSourceGroups: Object,
  onNextClicked: Function,
  setPipelineExecutorStep: Function
};

class DiscoverVisualizerPickerContainer extends PureComponent<Props> {
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
    const dataSourceGroups = visualizerData.dataSourceGroups;
    Log.info('Selected visualizer', 'DiscoverVisualizerPickerContainer');
    self.addVisualizer(visualizerData).then(() => {
      if (dataSourceGroups.length === 1) {
        self.handleSelectPipeline(dataSourceGroups[0]);
      } else {
        self.props.onNextClicked();
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

    toast.info(
      `Automatically skipping pipeline selection since
      only one pipeline group discovered.`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000
      }
    );
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
    dispatch(
      etlActions.setPipelineIdAction({
        id: pipelineId
      })
    );

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
