import { BASE_URL, rest } from "./api.service";
import { getQueryString } from "../_helpers";

const PIPELINES_URL = BASE_URL + "pipelines/";
const PIPELINE_URL = BASE_URL + "pipeline/";
const DISCOVERY_URL = BASE_URL + "discovery/";
const DISCOVERY_STATUS_URL = discoveryId => {
  return DISCOVERY_URL + discoveryId + "/status";
};

const DISCOVER_FROM_INPUT_URL = PIPELINES_URL + "discoverFromInput";
const DISCOVER_FROM_URI_LIST_URL = PIPELINES_URL + "discover";
const PIPELINE_GROUPS_URL = discoveryId => {
  return DISCOVERY_URL + discoveryId + "/pipelineGroups";
};

const EXPORT_PIPELINE_URL = (discoveryId, pipelineId) => {
  return discoveryId && pipelineId
    ? PIPELINE_URL +
        "exportWithSD?" +
        getQueryString({ discoveryId: discoveryId, pipelineUri: pipelineId })
    : "";
};

export const DiscoveryService = {
  postDiscoverFromTtl: async function({ ttlFile }) {
    return rest(DISCOVER_FROM_INPUT_URL, ttlFile, "POST", undefined);
  },

  postDiscoverFromUriList: async function({ datasourceUris }) {
    return rest(DISCOVER_FROM_URI_LIST_URL, datasourceUris, "POST", undefined);
  },

  getDiscoveryStatus: async function({ discoveryId }) {
    return rest(DISCOVERY_STATUS_URL(discoveryId), undefined, "GET", undefined);
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
  }
};
