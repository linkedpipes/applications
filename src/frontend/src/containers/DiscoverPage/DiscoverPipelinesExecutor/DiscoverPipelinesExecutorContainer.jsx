import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import { etlActions } from '@ducks/etlDuck';
import DiscoverPipelinesExecutorComponent from './DiscoverPipelinesExecutorComponent';
import {
  ETLService,
  ETL_STATUS_MAP,
  ETL_STATUS_TYPE,
  SocketContext,
  Log
} from '@utils';
import { withWebId } from '@inrupt/solid-react-components';
import { discoverActions } from '../duck';

class DiscoverPipelinesExecutorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaderLabelText: 'Hold on...'
    };
  }

  componentDidMount = () => {
    const {
      discoveryId,
      pipelineId,
      webId,
      selectedVisualizer,
      onSetEtlExecutionStatus
    } = this.props;

    onSetEtlExecutionStatus('Queued');

    const visualizerCode =
      selectedVisualizer !== undefined
        ? selectedVisualizer.visualizer.visualizerCode
        : '';
    const self = this;
    self
      .exportPipeline(discoveryId, pipelineId)
      .then(json => {
        self.executePipeline(
          json.pipelineId,
          json.etlPipelineIri,
          webId,
          visualizerCode
        );
      })
      .catch(error => {
        Log.error(error.message, 'DiscoverPipelinesExecutorContainer');
        self.setState({
          loaderLabelText:
            'Sorry, the ETL is unable to execute the pipeline, try selecting different source...'
        });
      });
  };

  exportPipeline = (discoveryId, pipelineId) => {
    const { onAddSelectedResultGraphIriAction, onAddSingleExport } = this.props;
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

        onAddSingleExport(
          response.pipelineId,
          response.etlPipelineIri,
          response.resultGraphIri
        );
        onAddSelectedResultGraphIriAction(response.resultGraphIri);

        self.setState({
          loaderLabelText: 'Exported pipeline...'
        });

        return json;
      });
  };

  executePipeline = (pipelineId, etlPipelineIri, webId, visualizerCode) => {
    const { onAddSingleExecution } = this.props;
    const self = this;

    return ETLService.getExecutePipeline({
      etlPipelineIri,
      webId,
      selectedVisualiser: visualizerCode
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        const executionIri = json.iri;

        onAddSingleExecution(pipelineId, executionIri);

        self.setState({
          loaderLabelText:
            'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...'
        });

        self.startSocketListener(executionIri);

        return pipelineId;
      });
  };

  startSocketListener = executionIri => {
    const { socket, onSetEtlExecutionStatus } = this.props;
    const self = this;

    socket.emit('join', executionIri);
    socket.on('executionStatus', data => {
      Log.info(data, 'DiscoverPipelinesExecutorContainer');
      const executionCrashed = data === 'Crashed';
      if (!data || executionCrashed) {
        self.setState({
          loaderLabelText:
            'There was an error during the pipeline execution. Please, try different sources.'
        });
      } else {
        const parsedData = JSON.parse(data);
        Log.info(parsedData, 'DiscoverPipelinesExecutorContainer');
        let status = ETL_STATUS_MAP[parsedData.status.statusIri]
          ? ETL_STATUS_MAP[parsedData.status.statusIri]
          : ETL_STATUS_MAP[parsedData.status['@id']];

        if (status === undefined) {
          self.setState({
            loaderLabelText: 'Unknown status for checking pipeline execution'
          });
          status = 'Unknown';
        }

        self.setState({
          loaderLabelText: `ETL responded with status : ${status}`
        });

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed
        ) {
          onSetEtlExecutionStatus(status);
          socket.emit('leave', executionIri);
        }
      }
    });
  };

  render() {
    const { loaderLabelText } = this.state;
    const { etlExecutionStatus } = this.props;
    return (
      <DiscoverPipelinesExecutorComponent
        etlExecutionIsFinished={etlExecutionStatus}
        loaderLabelText={loaderLabelText}
      />
    );
  }
}

DiscoverPipelinesExecutorContainer.propTypes = {
  discoveryId: PropTypes.any,
  etlExecutionStatus: PropTypes.any,
  onAddSelectedResultGraphIriAction: PropTypes.any,
  onAddSingleExecution: PropTypes.any,
  onAddSingleExport: PropTypes.any,
  onSetEtlExecutionStatus: PropTypes.any,
  pipelineId: PropTypes.any,
  selectedVisualizer: PropTypes.any,
  socket: PropTypes.any,
  webId: PropTypes.any
};

const mapStateToProps = state => {
  return {
    pipelineId: state.etl.pipelineId,
    discoveryId: state.discovery.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    etlExecutionStatus: state.discover.etlExecutionStatus
  };
};

const mapDispatchToProps = dispatch => {
  const onSetEtlExecutionStatus = status =>
    dispatch(discoverActions.setEtlExecutionStatus(status));

  const onAddSingleExport = (pipelineId, etlPipelineIri, resultGraphIri) =>
    dispatch(
      etlActions.addSingleExport({
        id: pipelineId,
        etlPipelineIri,
        resultGraphIri
      })
    );

  const onAddSelectedResultGraphIriAction = resultGraphIri =>
    dispatch(
      etlActions.addSelectedResultGraphIriAction({
        data: resultGraphIri
      })
    );

  const onAddSingleExecution = (pipelineId, executionIri) =>
    dispatch(
      etlActions.addSingleExecution({
        id: pipelineId,
        executionIri
      })
    );

  return {
    onAddSingleExport,
    onAddSelectedResultGraphIriAction,
    onSetEtlExecutionStatus,
    onAddSingleExecution
  };
};

const DiscoverPipelinesExecutorContainerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => (
      <DiscoverPipelinesExecutorContainer {...props} socket={socket} />
    )}
  </SocketContext.Consumer>
);

export default withWebId(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DiscoverPipelinesExecutorContainerWithSocket)
);
