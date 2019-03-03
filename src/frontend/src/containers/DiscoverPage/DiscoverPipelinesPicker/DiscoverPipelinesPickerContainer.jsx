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

  // exportPipeline = (discoveryId, pipelineId) => {
  //   const self = this;

  //   return ETLService.getExportPipeline({
  //     discoveryId,
  //     pipelineId
  //   })
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(json => {
  //       const response = json;

  //       self.props.dispatch(
  //         etlActions.addSingleExport({
  //           id: response.pipelineId,
  //           etlPipelineIri: response.etlPipelineIri,
  //           resultGraphIri: response.resultGraphIri
  //         })
  //       );

  //       self.props.dispatch(
  //         globalActions.addSelectedResultGraphIriAction({
  //           data: response.resultGraphIri
  //         })
  //       );

  //       return json;
  //     });
  // };

  // executePipeline = (pipelineId, etlPipelineIri) => {
  //   const self = this;

  //   // TODO : add custom logger
  //   // console.log('Sending the execute pipeline request...');

  //   return ETLService.getExecutePipeline({
  //     etlPipelineIri
  //   })
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(json => {
  //       // TODO : add custom logger
  //       // console.log(`Execute pipeline request sent!`, { autoClose: 2000 });

  //       self.props.dispatch(
  //         etlActions.addSingleExecution({
  //           id: pipelineId,
  //           executionIri: json.iri
  //         })
  //       );

  //       return pipelineId;
  //     });
  // };

  // checkExecutionStatus = (pipelineId, loadingButtonId, tid) => {
  //   const { executions } = this.props;
  //   const executionValues = executions[pipelineId];
  //   const self = this;

  //   tid =
  //     tid === undefined
  //       ? toast.info(
  //           'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...',
  //           {
  //             position: toast.POSITION.TOP_RIGHT,
  //             autoClose: false
  //           }
  //         )
  //       : tid;

  //   return ETLService.getExecutionStatus({
  //     executionIri: executionValues.executionIri
  //   })
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(json => {
  //       let response = 'Status: ';
  //       const status = ETL_STATUS_MAP[json.status['@id']];

  //       if (status === undefined) {
  //         // TODO : add custom logger
  //         //   console.log('Unknown status for checking pipeline execution');
  //       }

  //       response += status;

  //       if (
  //         status === ETL_STATUS_TYPE.Finished ||
  //         status === ETL_STATUS_TYPE.Cancelled ||
  //         status === ETL_STATUS_TYPE.Unknown ||
  //         status === ETL_STATUS_TYPE.Failed ||
  //         response === 'Success'
  //       ) {
  //         self.updateLoadingButton(loadingButtonId, true);
  //         if (status === ETL_STATUS_TYPE.Failed) {
  //           toast.update(tid, {
  //             render:
  //               'Sorry, the ETL is unable to execute the pipeline, try selecting different source...',
  //             type: toast.TYPE.ERROR,
  //             autoClose: EXECUTION_STATUS_TIMEOUT
  //           });
  //         } else {
  //           toast.update(tid, {
  //             render: response,
  //             type: toast.TYPE.INFO,
  //             autoClose: EXECUTION_STATUS_TIMEOUT
  //           });

  //           setTimeout(() => {
  //             self.props.handleNextStep();
  //           }, 500);
  //         }
  //       } else {
  //         setTimeout(() => {
  //           self.checkExecutionStatus(pipelineId, loadingButtonId, tid);
  //         }, 5000);
  //       }
  //     });
  // };

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
