import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import { globalActions } from '@ducks/globalDuck';
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

    onSetEtlExecutionStatus(false);

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
        console.log(error.message);
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
    const { onAddSingleExecution, onSetEtlExecutionStatus } = this.props;
    const self = this;

    // TODO : add custom logger
    // console.log('Sending the execute pipeline request...');

    return ETLService.getExecutePipeline({
      etlPipelineIri,
      webId,
      selectedVisualiser: visualizerCode
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        // TODO : add custom logger
        // console.log(`Execute pipeline request sent!`, { autoClose: 2000 });
        const executionIri = json.iri;

        onAddSingleExecution(pipelineId, executionIri);

        self.setState({
          loaderLabelText:
            'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...'
        });

        setTimeout(() => {
          self.setState({
            loaderLabelText: `ETL finished with status : Success`
          });
          onSetEtlExecutionStatus(true);
        }, 30000);

        return pipelineId;
      });
  };

  // startSocketListener = executionIri => {
  //   const { socket, onSetEtlExecutionStatus } = this.props;
  //   const self = this;

  //   // socket.emit('join', executionIri);
  //   // socket.on('executionStatus', data => {
  //   //   Log.info(data, 'DiscoverPipelinesExecutorContainer');
  //   //   const executionCrashed = data === 'Crashed';
  //   //   if (!data || executionCrashed) {
  //   //     self.setState({
  //   //       loaderLabelText:
  //   //         'There was an error during the pipeline execution. Please, try different sources.'
  //   //     });
  //   //   } else {
  //   //     const parsedData = JSON.parse(data);
  //   //     let response = 'Status: ';
  //   //     const status = ETL_STATUS_MAP[parsedData.status.id];

  //   //     if (status === undefined) {
  //   //       self.setState({
  //   //         loaderLabelText: 'Unknown status for checking pipeline execution'
  //   //       });
  //   //     }

  //   //     response += status;

  //   //     if (
  //   //       status === ETL_STATUS_TYPE.Finished ||
  //   //       status === ETL_STATUS_TYPE.Cancelled ||
  //   //       status === ETL_STATUS_TYPE.Unknown ||
  //   //       status === ETL_STATUS_TYPE.Failed ||
  //   //       response === 'Success'
  //   //     ) {
  //   //       if (status === ETL_STATUS_TYPE.Failed) {
  //   //         self.setState({
  //   //           loaderLabelText:
  //   //             'Sorry, the ETL is unable to execute the pipeline, try selecting different source...'
  //   //         });
  //   //       }
  //   //     } else {
  //   //       self.setState({
  //   //         loaderLabelText: `ETL finished with status : ${response}`
  //   //       });

  //   //       onSetEtlExecutionStatus(true);
  //   //       // TODO : process next step here
  //   //     }
  //   //   }
  //   //   socket.emit('leave', executionIri);
  //   // });
  // };

  render() {
    const { etlExecutionStatus, loaderLabelText } = this.state;
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
    pipelineId: state.globals.pipelineId,
    discoveryId: state.globals.discoveryId,
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
      globalActions.addSelectedResultGraphIriAction({
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
