import { BASE_URL, rest } from './api.service';
import { getQueryString } from './utils';

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

const EXECUTION_URL = `${BASE_URL}execution/`;
const PIPELINE_URL = `${BASE_URL}pipeline/`;

const EXPORT_PIPELINE_URL = (discoveryId, pipelineId) => {
  return discoveryId && pipelineId
    ? `${PIPELINE_URL}exportWithSD?${getQueryString({
        discoveryId: discoveryId,
        pipelineUri: pipelineId
      })}`
    : '';
};

const EXECUTE_PIPELINE_URL = etlPipelineIri => {
  return etlPipelineIri
    ? `${PIPELINE_URL}execute?${getQueryString({
        etlPipelineIri: etlPipelineIri
      })}`
    : '';
};

const EXECUTION_STATUS_URL = executionIri => {
  return (
    `${EXECUTION_URL}status` +
    `?${getQueryString({ executionIri: executionIri })}`
  );
};

export const ETLService = {
  async getExecutePipeline({ etlPipelineIri }) {
    return rest(
      EXECUTE_PIPELINE_URL(etlPipelineIri),
      undefined,
      'GET',
      undefined
    );
  },

  async getExportPipeline({ discoveryId, pipelineId }) {
    return rest(
      EXPORT_PIPELINE_URL(discoveryId, pipelineId),
      undefined,
      'GET',
      undefined
    );
  },

  async getExecutionStatus({ executionIri }) {
    return rest(
      EXECUTION_STATUS_URL(executionIri),
      undefined,
      'GET',
      undefined
    );
  }
};
