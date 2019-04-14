import axios from 'axios';

export const ETL_STATUS_MAP = {
  'http://etl.linkedpipes.com/resources/status/queued': 'Queued',
  'http://etl.linkedpipes.com/resources/status/mapped': 'Mapped',
  'http://etl.linkedpipes.com/resources/status/initializing': 'Initializing',
  'http://etl.linkedpipes.com/resources/status/running': 'Running',
  'http://etl.linkedpipes.com/resources/status/finished': 'Finished',
  'http://etl.linkedpipes.com/resources/status/cancelled': 'Cancelled',
  'http://etl.linkedpipes.com/resources/status/cancelling': 'Cancelling',
  'http://etl.linkedpipes.com/resources/status/failed': 'Failed',
  'http://etl.linkedpipes.com/resources/status/unknown': 'Unknown'
};

export const ETL_STATUS_TYPE = {
  Mapped: 'Mapped',
  Queued: 'Queued',
  Initializing: 'Initializing',
  Running: 'Running',
  Finished: 'Finished',
  Cancelled: 'Cancelled',
  Cancelling: 'Cancelling',
  Failed: 'Failed',
  Unknown: 'Unknown'
};

export const ETLService = {
  async getExecutePipeline({ etlPipelineIri, webId, selectedVisualiser }) {
    return axios.post('/pipeline/execute', null, {
      params: {
        etlPipelineIri,
        webId,
        selectedVisualiser
      }
    });
  },

  async getExportPipeline({ discoveryId, pipelineId }) {
    return axios.get('/pipeline/exportWithSD', {
      params: {
        discoveryId,
        pipelineUri: pipelineId
      }
    });
  },

  async getExecutionStatus({ executionIri }) {
    return axios.get('/pipeline/status', {
      params: {
        executionIri
      }
    });
  },

  async getPipeline({ pipelineIri }) {
    return axios.get('/pipeline', {
      params: {
        pipelineIri
      }
    });
  }
};
