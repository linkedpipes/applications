// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { discoverActions } from '../duck';
import { etlActions } from '@ducks/etlDuck';
import DiscoverPipelinesPickerComponent from './DiscoverPipelinesPickerComponent';
import ErrorBoundary from 'react-error-boundary';
import { GoogleAnalyticsWrapper } from '@utils';

type Props = {
  dataSourceGroups: [],
  discoveryId: string,
  handleSetSelectedPipelineId: Function,
  onNextClicked: Function
};

type State = {
  order: string,
  orderBy: string,
  page: number,
  rowsPerPage: number,
  loadingButtons: {}
};

class DiscoverPipelinesPickerContainer extends PureComponent<Props, State> {
  state = {
    order: 'asc',
    orderBy: 'id',
    page: 0,
    rowsPerPage: 5,
    loadingButtons: {}
  };

  updateLoadingButton = (loadingButtonId, enabled) => {
    const { loadingButtons } = this.state;

    if (enabled) {
      delete loadingButtons[loadingButtonId];
    } else {
      loadingButtons[loadingButtonId] = true;
    }

    this.setState({ loadingButtons });
  };

  handleSelectPipeline = datasourceAndPipelines => {
    GoogleAnalyticsWrapper.trackEvent({
      category: 'Discovery',
      action: 'Selected pipeline : step 3'
    });

    const { handleSetSelectedPipelineId, onNextClicked } = this.props;
    const pipelines = datasourceAndPipelines.pipelines;
    pipelines.sort((a, b) => a.minimalIteration < b.minimalIteration);
    const pipelineWithMinIterations = pipelines[0];
    const pipelineId = pipelineWithMinIterations.id;

    handleSetSelectedPipelineId(pipelineId);
    onNextClicked();
  };

  render() {
    const { order, orderBy, rowsPerPage, loadingButtons, page } = this.state;
    const { dataSourceGroups, discoveryId } = this.props;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, dataSourceGroups.length - page * rowsPerPage);

    return (
      <ErrorBoundary>
        <DiscoverPipelinesPickerComponent
          order={order}
          orderBy={orderBy}
          dataSourceGroups={dataSourceGroups}
          rowsPerPage={rowsPerPage}
          page={page}
          loadingButtons={loadingButtons}
          emptyRows={emptyRows}
          onSelectPipeline={this.handleSelectPipeline}
          discoveryId={discoveryId}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = state => {
  return {
    exportsDict: state.etl.exports,
    executions: state.etl.executions,
    discoveryId: state.discovery.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    dataSourceGroups:
      state.globals.selectedVisualizer !== undefined
        ? state.globals.selectedVisualizer.dataSourceGroups
        : []
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSelectedPipelineId = pipelineId =>
    dispatch(
      etlActions.setPipelineIdAction({
        id: pipelineId
      })
    );

  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));

  return {
    handleSetSelectedPipelineId,
    onNextClicked
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverPipelinesPickerContainer);
