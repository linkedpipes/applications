import { BASE_URL, rest } from './api.service';
import { getQueryString } from './utils';

const PIPELINES_URL = `${BASE_URL}pipelines/`;
const DISCOVERY_URL = `${BASE_URL}discovery/`;
const DISCOVERY_STATUS_URL = discoveryId => {
  return `${DISCOVERY_URL + discoveryId}/status`;
};

const DISCOVER_FROM_INPUT_URL = `${PIPELINES_URL}discoverFromInput`;
const DISCOVER_FROM_ENDPOINT = `${PIPELINES_URL}discoverFromEndpoint`;
const DISCOVER_FROM_URI_LIST_URL = `${PIPELINES_URL}discover`;
const PIPELINE_GROUPS_URL = discoveryId => {
  return `${DISCOVERY_URL + discoveryId}/pipelineGroups`;
};

const DiscoveryService = {
  async postDiscoverFromTtl({ ttlFile }) {
    return rest(DISCOVER_FROM_INPUT_URL, ttlFile, 'POST', undefined);
  },

  async postDiscoverFromEndpoint({
    sparqlEndpointIri,
    dataSampleIri,
    namedGraph
  }) {
    return rest(
      `${DISCOVER_FROM_ENDPOINT}?${getQueryString({
        sparqlEndpointIri: sparqlEndpointIri,
        dataSampleIri: dataSampleIri,
        namedGraph: namedGraph
      })}`,
      undefined,
      'POST',
      undefined
    );
  },

  async postDiscoverFromUriList({ datasourceUris }) {
    return rest(DISCOVER_FROM_URI_LIST_URL, datasourceUris, 'POST', undefined);
  },

  async getDiscoveryStatus({ discoveryId }) {
    return rest(DISCOVERY_STATUS_URL(discoveryId), undefined, 'GET', undefined);
  },

  async getPipelineGroups({ discoveryId }) {
    return rest(PIPELINE_GROUPS_URL(discoveryId), undefined, 'GET', undefined);
  }
};

export default DiscoveryService;
