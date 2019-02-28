import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import { toast } from 'react-toastify';
import { ETLService, ETL_STATUS_MAP, ETL_STATUS_TYPE } from '../../_services';
import { addSingleExecution } from '../../_actions/etl_executions';
import { addSingleExport } from '../../_actions/etl_exports';
import { addSelectedResultGraphIriAction } from '../../_actions/globals';
import DiscoverPipelinesPickerComponent from './DiscoverPipelinesPickerComponent';
import ErrorBoundary from 'react-error-boundary';

const EXECUTION_STATUS_TIMEOUT = 10000;

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

  exportAndStartPolling = (discoveryId, datasourceAndPipelines) => {
    const self = this;
    const pipelines = datasourceAndPipelines.pipelines;
    pipelines.sort((a, b) => a.minimalIteration < b.minimalIteration);

    const pipelineWithMinIterations = pipelines[0];
    const pipelineId = pipelineWithMinIterations.id;
    const datasourceTitle = datasourceAndPipelines.dataSources[0].label;
    const loadingButtonId = `button_${datasourceTitle}`;

    self.updateLoadingButton(loadingButtonId, false);
    self
      .exportPipeline(discoveryId, pipelineId)
      .then(json => {
        self
          .executePipeline(json.pipelineId, json.etlPipelineIri)
          .then(pipelineId => {
            self.checkExecutionStatus(pipelineId, loadingButtonId, undefined);
          });
      })
      .catch(error => {
        // Enable the fields
        self.updateLoadingButton(loadingButtonId, true);

        toast.error(
          'Sorry, the ETL is unable to execute the pipeline, try selecting different source...',
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      });
  };

  exportPipeline = (discoveryId, pipelineId) => {
    const self = this;

    return ETLService.getExportPipeline({
      discoveryId,
      pipelineId
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        const response = json;

        self.props.dispatch(
          addSingleExport({
            id: response.pipelineId,
            etlPipelineIri: response.etlPipelineIri,
            resultGraphIri: response.resultGraphIri
          })
        );

        self.props.dispatch(
          addSelectedResultGraphIriAction({
            data: response.resultGraphIri
          })
        );

        return json;
      });
  };

  executePipeline = (pipelineId, etlPipelineIri) => {
    const self = this;

    // TODO : add custom logger
    // console.log('Sending the execute pipeline request...');

    return ETLService.getExecutePipeline({
      etlPipelineIri
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        // TODO : add custom logger
        // console.log(`Execute pipeline request sent!`, { autoClose: 2000 });

        self.props.dispatch(
          addSingleExecution({
            id: pipelineId,
            executionIri: json.iri
          })
        );

        return pipelineId;
      });
  };

  checkExecutionStatus = (pipelineId, loadingButtonId, tid) => {
    const { executions } = this.props;
    const executionValues = executions.executions[pipelineId];
    const self = this;

    tid =
      tid === undefined
        ? toast.info(
            'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...',
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: false
            }
          )
        : tid;

    return ETLService.getExecutionStatus({
      executionIri: executionValues.executionIri
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        let response = 'Status: ';
        const status = ETL_STATUS_MAP[json.status['@id']];

        if (status === undefined) {
          // TODO : add custom logger
          //   console.log('Unknown status for checking pipeline execution');
        }

        response += status;

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed ||
          response === 'Success'
        ) {
          self.updateLoadingButton(loadingButtonId, true);
          if (status === ETL_STATUS_TYPE.Failed) {
            toast.update(tid, {
              render: `Sorry, the ETL is unable to execute the pipeline, try${+'selecting different source...'}`,
              type: toast.TYPE.ERROR,
              autoClose: EXECUTION_STATUS_TIMEOUT
            });
          } else {
            toast.update(tid, {
              render: response,
              type: toast.TYPE.INFO,
              autoClose: EXECUTION_STATUS_TIMEOUT
            });

            setTimeout(() => {
              self.props.handleNextStep();
            }, 500);
          }
        } else {
          setTimeout(() => {
            self.checkExecutionStatus(pipelineId, loadingButtonId, tid);
          }, 5000);
        }
      });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
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
          exportAndStartPolling={this.exportAndStartPolling}
          discoveryId={discoveryId}
        />
      </ErrorBoundary>
    );
  }
}

DiscoverPipelinesPickerContainer.propTypes = {
  dataSourceGroups: PropTypes.any,
  discoveryId: PropTypes.any,
  executions: PropTypes.any
};

const mapStateToProps = state => {
  return {
    exportsDict: state.etl_exports,
    executions: state.etl_executions,
    discoveryId: state.globals.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    dataSourceGroups:
      state.globals.selectedVisualizer !== undefined
        ? state.globals.selectedVisualizer.dataSourceGroups
        : []
  };
};

export default connect(mapStateToProps)(DiscoverPipelinesPickerContainer);
