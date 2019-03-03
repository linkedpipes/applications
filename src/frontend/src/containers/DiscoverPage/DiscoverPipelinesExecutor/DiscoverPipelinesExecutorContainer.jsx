import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/lib/connect/connect';
import { globalActions } from '@ducks/globalDuck';
import { etlActions } from '@ducks/etlDuck';
import DiscoverPipelinesExecutorComponent from './DiscoverPipelinesExecutorComponent';
import { ETLService } from '@utils';
import ErrorBoundary from 'react-error-boundary';

class DiscoverPipelinesExecutorContainer extends PureComponent {
  state = {
    etlExecutionIsFinished: false,
    loaderLabelText: 'Hold on...'
  };

  componentDidMount() {
    const { discoveryId, pipelineId } = this.props;
    const self = this;
    this.exportPipeline(discoveryId, pipelineId)
      .then(json => {
        self.executePipeline(json.pipelineId, json.etlPipelineIri);
      })
      .catch(error => {
        console.log(error.message);
        self.setState({
          loaderLabelText:
            'Sorry, the ETL is unable to execute the pipeline, try selecting different source...'
        });
      });
  }

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
          etlActions.addSingleExecution({
            id: pipelineId,
            executionIri: json.iri
          })
        );

        self.setState({
          loaderLabelText:
            'Please, hold on ETL is chatting with Tim Berners-Lee 🕴...'
        });

        return pipelineId;
      });
  };

  render() {
    const { etlExecutionIsFinished, loaderLabelText } = this.state;
    return (
      <ErrorBoundary>
        <DiscoverPipelinesExecutorComponent
          etlExecutionIsFinished={etlExecutionIsFinished}
          loaderLabelText={loaderLabelText}
        />
      </ErrorBoundary>
    );
  }
}

DiscoverPipelinesExecutorContainer.propTypes = {
  discoveryId: PropTypes.any,
  pipelineId: PropTypes.any
};

const mapStateToProps = state => {
  return {
    pipelineId: state.globals.pipelineId,
    discoveryId: state.globals.discoveryId
  };
};

export default connect(mapStateToProps)(DiscoverPipelinesExecutorContainer);
