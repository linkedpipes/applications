import "whatwg-fetch";
import { getQueryString } from "../_helpers";

const rest = (
  url,
  body = "",
  method = "POST",
  contentType = "application/json"
) => {
  console.log("Sending request:\n");
  console.log("URL: " + url + "\n");
  console.log("Body: " + JSON.stringify(body) + "\n");
  console.log("Method: " + method + "\n");

  return method === "POST"
    ? fetch(url, {
        method: method,
        body: body.constructor === File ? body : JSON.stringify(body),
        headers: {
          "Content-Type": contentType
        },
        credentials: "same-origin"
      })
    : fetch(url);
};

const BASE_URL = process.env.BASE_BACKEND_URL;

const PIPELINES_URL = BASE_URL + "pipelines/";
const PIPELINE_URL = BASE_URL + "pipeline/";
const DISCOVERY_URL = BASE_URL + "discovery/";
const EXECUTION_URL = BASE_URL + "execution/";

const DISCOVER_FROM_INPUT_URL = PIPELINES_URL + "discoverFromInput";
const DISCOVER_FROM_URI_LIST_URL = PIPELINES_URL + "discover";
const PIPELINE_GROUPS_URL = discoveryId => {
  return DISCOVERY_URL + discoveryId + "/pipelineGroups";
};
const GET_MARKERS_URL = BASE_URL + "map/markers";

export const ETL_STATUS_MAP = {
  "http://etl.linkedpipes.com/resources/status/queued": "Queued",
  "http://etl.linkedpipes.com/resources/status/mapped": "Mapped",
  "http://etl.linkedpipes.com/resources/status/initializing": "Initializing",
  "http://etl.linkedpipes.com/resources/status/running": "Running",
  "http://etl.linkedpipes.com/resources/status/finished": "Finished",
  "http://etl.linkedpipes.com/resources/status/cancelled": "Cancelled",
  "http://etl.linkedpipes.com/resources/status/cancelling": "Cancelling",
  "http://etl.linkedpipes.com/resources/status/failed": "Failed",
  "http://etl.linkedpipes.com/resources/status/unknown": "Unknown"
};

export const ETL_STATUS_TYPE = {
  Mapped: "Mapped",
  Queued: "Queued",
  Initializing: "Initializing",
  Running: "Running",
  Finished: "Finished",
  Cancelled: "Cancelled",
  Cancelling: "Cancelling",
  Failed: "Failed",
  Unknown: "Unknown"
};

const EXPORT_PIPELINE_URL = (discoveryId, pipelineId) => {
  return discoveryId && pipelineId
    ? PIPELINE_URL +
        "export?" +
        getQueryString({ discoveryId: discoveryId, pipelineUri: pipelineId })
    : "";
};

const EXECUTE_PIPELINE_URL = etlPipelineIri => {
  return etlPipelineIri
    ? PIPELINE_URL +
        "execute?" +
        getQueryString({ etlPipelineIri: etlPipelineIri })
    : "";
};

const EXECUTION_STATUS_URL = executionIri => {
  return (
    EXECUTION_URL +
    "status" +
    "?" +
    getQueryString({ executionIri: executionIri })
  );
};

export const DiscoveryService = {
  postDiscoverFromTtl: async function({ ttlFile }) {
    return rest(DISCOVER_FROM_INPUT_URL, ttlFile, "POST", undefined);
  },

  // TODO: refactor later, move to separate class responsible for _services calls
  postDiscoverFromUriList: async function({ datasourceUris }) {
    return rest(DISCOVER_FROM_URI_LIST_URL, datasourceUris, "POST", undefined);
  },

  getPipelineGroups: async function({ discoveryId }) {
    return rest(PIPELINE_GROUPS_URL(discoveryId), undefined, "GET", undefined);
  },

  getExportPipeline: async function({ discoveryId, pipelineId }) {
    return rest(
      EXPORT_PIPELINE_URL(discoveryId, pipelineId),
      undefined,
      "GET",
      undefined
    );
  },

  getExecutePipeline: async function({ etlPipelineIri }) {
    return rest(
      EXECUTE_PIPELINE_URL(etlPipelineIri),
      undefined,
      "GET",
      undefined
    );
  },

  getExecutionStatus: async function({ executionIri }) {
    return rest(
      EXECUTION_STATUS_URL(executionIri),
      undefined,
      "GET",
      undefined
    );
  },

  getMarkers: async function(applicationId, pipelineIri, filters = {}) {
    return rest(GET_MARKERS_URL, filters, "POST");
  }
};
