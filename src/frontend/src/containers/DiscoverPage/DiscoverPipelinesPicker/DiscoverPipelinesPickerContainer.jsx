import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import { discoverActions } from '../duck';
import { globalActions } from '@ducks/globalDuck';
import DiscoverPipelinesPickerComponent from './DiscoverPipelinesPickerComponent';
import ErrorBoundary from 'react-error-boundary';

class DiscoverPipelinesPickerContainer extends PureComponent {
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

DiscoverPipelinesPickerContainer.propTypes = {
  dataSourceGroups: PropTypes.any,
  discoveryId: PropTypes.any,
  executions: PropTypes.any,
  handleSetSelectedPipelineId: PropTypes.any,
  onNextClicked: PropTypes.any
};

const mapDispatchToProps = dispatch => {
  const handleSetSelectedPipelineId = pipelineId =>
    dispatch(
      globalActions.setPipelineIdAction({
        id: pipelineId
      })
    );

  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));

  return {
    handleSetSelectedPipelineId,
    onNextClicked
  };
};

const mapStateToProps = state => {
  return {
    exportsDict: state.etl.exports,
    executions: state.etl.executions,
    discoveryId: state.globals.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    dataSourceGroups:
      state.globals.selectedVisualizer !== undefined
        ? state.globals.selectedVisualizer.dataSourceGroups
        : []
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverPipelinesPickerContainer);
