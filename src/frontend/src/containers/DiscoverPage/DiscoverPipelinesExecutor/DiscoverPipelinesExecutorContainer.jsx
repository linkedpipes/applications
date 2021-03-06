// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { etlActions } from '@ducks/etlDuck';
import DiscoverPipelinesExecutorComponent from './DiscoverPipelinesExecutorComponent';
import { discoverActions } from '../duck';
import {
  ETLService,
  ETL_STATUS_MAP,
  ETL_STATUS_TYPE,
  SocketContext,
  Log
} from '@utils';

type Props = {
  handleSetPipelineExecutionIri: Function,
  discoveryId: string,
  etlExecutionStatus: Object,
  handleSetResultPipelineIri: Function,
  onSetEtlExecutionStatus: Object,
  pipelineId: string,
  selectedVisualizer: Object,
  socket: Object,
  webId: string
};

type State = {
  loaderLabelText: string
};

class DiscoverPipelinesExecutorContainer extends PureComponent<Props, State> {
  isMounted = false;

  state = {
    loaderLabelText: 'Hold on...'
  };

  componentDidMount = () => {
    this.isMounted = true;

    const {
      discoveryId,
      pipelineId,
      selectedVisualizer,
      onSetEtlExecutionStatus
    } = this.props;

    onSetEtlExecutionStatus('Queued');

    const self = this;
    self
      .exportPipeline(discoveryId, pipelineId)
      .then(json => {
        const visualizerCode =
          selectedVisualizer !== undefined
            ? selectedVisualizer.visualizer.visualizerCode
            : '';
        self.executePipeline(
          json.pipelineId,
          json.etlPipelineIri,
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

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  exportPipeline = (discoveryId, pipelineId) => {
    const { handleSetResultPipelineIri } = this.props;
    const self = this;

    return ETLService.getExportPipeline({
      discoveryId,
      pipelineId
    })
      .then(response => {
        return response.data;
      })
      .then(json => {
        const response = json;

        handleSetResultPipelineIri(response.resultGraphIri);

        self.setState({
          loaderLabelText: 'Exported pipeline...'
        });

        return json;
      });
  };

  executePipeline = (pipelineId, etlPipelineIri, visualizerCode) => {
    const { webId, handleSetPipelineExecutionIri } = this.props;
    const self = this;

    return ETLService.getExecutePipeline({
      etlPipelineIri,
      webId,
      selectedVisualiser: visualizerCode
    })
      .then(response => {
        return response.data;
      })
      .then(json => {
        const executionIri = json.iri;

        handleSetPipelineExecutionIri(executionIri);

        self.setState({
          loaderLabelText: 'Please, hold on processing the pipeline...'
        });

        self.startSocketListener(executionIri);

        return pipelineId;
      });
  };

  startSocketListener = executionIri => {
    const { socket, onSetEtlExecutionStatus } = this.props;
    const self = this;

    socket.on('executionStatus', data => {
      if (data === undefined || !self.isMounted) {
        return;
      }

      const parsedData = JSON.parse(data);

      if (parsedData.executionIri !== executionIri) {
        return;
      }

      Log.info(data, 'DiscoverPipelinesExecutorContainer');

      if (parsedData.error || parsedData.timeout) {
        self.setState({
          loaderLabelText:
            'There was an error during the pipeline execution. Please, try different sources.'
        });
      } else {
        Log.info(parsedData, 'DiscoverPipelinesExecutorContainer');
        const parsedStatus = parsedData.status.status;

        let status;

        if (parsedStatus && parsedStatus.statusIri) {
          status = ETL_STATUS_MAP[parsedStatus.statusIri]
            ? ETL_STATUS_MAP[parsedStatus.statusIri]
            : ETL_STATUS_MAP[parsedStatus['@id']];
        }

        if (status === undefined) {
          self.setState({
            loaderLabelText: 'Unknown status for checking pipeline execution'
          });
          status = 'Unknown';
        }

        self.setState({
          loaderLabelText: `Pipeline execution status : ${status}`
        });

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed
        ) {
          onSetEtlExecutionStatus(status);
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
        ls
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    pipelineId: state.etl.pipelineId,
    discoveryId: state.discovery.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer,
    etlExecutionStatus: state.discover.etlExecutionStatus,
    webId: state.user.webId
  };
};

const mapDispatchToProps = dispatch => {
  const onSetEtlExecutionStatus = status =>
    dispatch(discoverActions.setEtlExecutionStatus(status));

  const handleSetResultPipelineIri = resultGraphIri =>
    dispatch(etlActions.addSelectedResultGraphIriAction(resultGraphIri));

  const handleSetPipelineExecutionIri = executionIri => {
    dispatch(etlActions.setSelectedPipelineExecution(executionIri));
  };

  return {
    handleSetResultPipelineIri,
    handleSetPipelineExecutionIri,
    onSetEtlExecutionStatus
  };
};

const DiscoverPipelinesExecutorContainerWithSocket = props => (
  <SocketContext.Consumer>
    {socket => (
      <DiscoverPipelinesExecutorContainer {...props} socket={socket} />
    )}
  </SocketContext.Consumer>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverPipelinesExecutorContainerWithSocket);
