import { getQueryString } from "../_helpers/utils";

const BASE_URL = "./api/";

const PIPELINES_URL = BASE_URL + "pipelines/";
const PIPELINE_URL = BASE_URL + "pipeline/";
const DISCOVERY_URL = BASE_URL + "discovery/";
const EXECUTION_URL = BASE_URL + "execution/";

export const DISCOVER_FROM_INPUT_URL = PIPELINES_URL + "discoverFromInput";
export const DISCOVER_FROM_URI_LIST_URL = PIPELINES_URL + "discover";
export const PIPELINE_GROUPS_URL = discoveryId => {
  return DISCOVERY_URL + discoveryId + "/pipelineGroups";
};

export const ETL_STATUS_MAP = {
  "http://etl.linkedpipes.com/resources/status/mapped": "Mapped",
  "http://etl.linkedpipes.com/resources/status/queued": "Queued",
  "http://etl.linkedpipes.com/resources/status/initializing": "Initializing",
  "http://etl.linkedpipes.com/resources/status/running": "Running",
  "http://etl.linkedpipes.com/resources/status/finished": "Finished",
  "http://etl.linkedpipes.com/resources/status/cancelled": "Cancelled",
  "http://etl.linkedpipes.com/resources/status/cancelling": "Cancelling",
  "http://etl.linkedpipes.com/resources/status/failed": "Failed",
  "http://etl.linkedpipes.com/resources/status/unknown": "Unknown"
};

export const ETL_STATUS_TYPE = {
  Mapped: 0,
  Queued: 1,
  Initializing: 2,
  Running: 3,
  Finished: 4,
  Cancelled: 5,
  Cancelling: 6,
  Failed: 7,
  Unknown: 8
};

export const EXPORT_PIPELINE_URL = (discoveryId, pipelineId) => {
  return discoveryId && pipelineId
    ? PIPELINE_URL +
        "export?" +
        getQueryString({ discoveryId: discoveryId, pipelineUri: pipelineId })
    : "";
};

export const EXECUTE_PIPELINE_URL = etlPipelineIri => {
  return etlPipelineIri
    ? PIPELINE_URL +
        "execute?" +
        getQueryString({ etlPipelineIri: etlPipelineIri })
    : "";
};

export const EXECUTION_STATUS_URL = executionIri => {
  return (
    EXECUTION_URL +
    "status" +
    "?" +
    getQueryString({ executionIri: executionIri })
  );
};
