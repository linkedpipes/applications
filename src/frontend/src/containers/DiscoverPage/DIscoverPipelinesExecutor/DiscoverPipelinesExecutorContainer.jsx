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
  SocketContext
} from '@utils';
import { withWebId } from '@inrupt/solid-react-components';

class DiscoverPipelinesExecutorContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      etlExecutionIsFinished: false,
      loaderLabelText: 'Hold on...'
    };
  }

  componentDidMount = () => {
    const { discoveryId, pipelineId, webId } = this.props;
    const self = this;
    self
      .exportPipeline(discoveryId, pipelineId)
      .then(json => {
        self.executePipeline(json.pipelineId, json.etlPipelineIri, webId);
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
          etlActions.addSingleExport({
            id: response.pipelineId,
            etlPipelineIri: response.etlPipelineIri,
            resultGraphIri: response.resultGraphIri
          })
        );

        self.props.dispatch(
          globalActions.addSelectedResultGraphIriAction({
            data: response.resultGraphIri
          })
        );

        self.setState({
          loaderLabelText: 'Exported pipeline...'
        });

        return json;
      });
  };

  executePipeline = (pipelineId, etlPipelineIri, webId) => {
    const self = this;

    // TODO : add custom logger
    // console.log('Sending the execute pipeline request...');

    return ETLService.getExecutePipeline({
      etlPipelineIri,
      webId
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        // TODO : add custom logger
        // console.log(`Execute pipeline request sent!`, { autoClose: 2000 });

        self.props.dispatch(
          etlActions.addSingleExecution({
            id: pipelineId,
            executionIri: json.iri
          })
        );

        self.setState({
          loaderLabelText:
            'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...'
        });

        self.startSocketListener(etlPipelineIri);

        return pipelineId;
      });
  };

  startSocketListener = executionIri => {
    const { socket } = this.props;
    const self = this;

    socket.emit('join', executionIri);
    socket.on('executionStatus', data => {
      if (data === undefined) {
        self.setState({
          loaderLabelText:
            'There was an error during the pipeline execution. Please, try different sources.'
        });
      } else {
        const parsedData = JSON.parse(data);
        let response = 'Status: ';
        const status = ETL_STATUS_MAP[parsedData.status['@id']];

        if (status === undefined) {
          self.setState({
            loaderLabelText: 'Unknown status for checking pipeline execution'
          });
        }

        response += status;

        if (
          status === ETL_STATUS_TYPE.Finished ||
          status === ETL_STATUS_TYPE.Cancelled ||
          status === ETL_STATUS_TYPE.Unknown ||
          status === ETL_STATUS_TYPE.Failed ||
          response === 'Success'
        ) {
          if (status === ETL_STATUS_TYPE.Failed) {
            self.setState({
              loaderLabelText:
                'Sorry, the ETL is unable to execute the pipeline, try selecting different source...'
            });
          }
        } else {
          self.setState({
            loaderLabelText: `ETL finished with status : ${response}`
          });
          // TODO : process next step here
        }
      }
      socket.emit('leave', executionIri);
    });
  };

  render() {
    const { etlExecutionIsFinished, loaderLabelText } = this.state;
    return (
      <DiscoverPipelinesExecutorComponent
        etlExecutionIsFinished={etlExecutionIsFinished}
        loaderLabelText={loaderLabelText}
      />
    );
  }
}

DiscoverPipelinesExecutorContainer.propTypes = {
  discoveryId: PropTypes.any,
  pipelineId: PropTypes.any,
  socket: PropTypes.any,
  webId: PropTypes.any
};

const mapStateToProps = state => {
  return {
    pipelineId: state.globals.pipelineId,
    discoveryId: state.globals.discoveryId
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
  connect(mapStateToProps)(DiscoverPipelinesExecutorContainerWithSocket)
);
