import lpaAxios from './api.service';

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
    return lpaAxios.post('/pipeline/execute', null, {
      params: {
        etlPipelineIri,
        webId,
        selectedVisualiser
      }
    });
  },

  async getExportPipeline({ discoveryId, pipelineId }) {
    return lpaAxios.get('/pipeline/exportWithSD', {
      params: {
        discoveryId,
        pipelineUri: pipelineId
      }
    });
  },

  async getExecutionStatus({ executionIri }) {
    return lpaAxios.get('/pipeline/status', {
      params: {
        executionIri
      }
    });
  },

  async getPipeline({ pipelineIri }) {
    return lpaAxios.get('/pipeline', {
      params: {
        pipelineIri
      }
    });
  },

  async getPipelineExecution({ executionIri }) {
    return lpaAxios.get('/pipeline/execution', {
      params: {
        executionIri
      }
    });
  },

  async setupRepeatedPipelineExecution({
    frequencyHours,
    webId,
    executionIri,
    selectedVisualiser
  }) {
    return lpaAxios.post('/pipeline/repeat', null, {
      params: {
        frequencyHours,
        webId,
        executionIri,
        selectedVisualiser
      }
    });
  },

  async toggleRepeatedPipelineExecution({ repeat, executionIri }) {
    return lpaAxios.put('/pipeline/repeat', null, {
      params: {
        repeat,
        executionIri
      }
    });
  }
};
