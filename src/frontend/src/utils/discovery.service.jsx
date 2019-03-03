import { BASE_URL, rest } from './api.service';
import { getQueryString } from './global.utils';

const PIPELINES_URL = `${BASE_URL}pipelines/`;
const DISCOVERY_URL = `${BASE_URL}discovery/`;
const DISCOVERY_STATUS_URL = discoveryId => {
  return `${DISCOVERY_URL + discoveryId}/status`;
};

const DISCOVER_FROM_INPUT_URL = webId => {
  return `${PIPELINES_URL}discoverFromInput?${getQueryString({
    webId
  })}`;
};
const DISCOVER_FROM_ENDPOINT = `${PIPELINES_URL}discoverFromEndpoint`;

const DISCOVER_FROM_URI_LIST_URL = webId => {
  return `${PIPELINES_URL}discover?${getQueryString({
    webId
  })}`;
};

const PIPELINE_GROUPS_URL = discoveryId => {
  return `${DISCOVERY_URL + discoveryId}/pipelineGroups`;
};

const DiscoveryService = {
  async postDiscoverFromTtl({ ttlFile, webId }) {
    return rest(DISCOVER_FROM_INPUT_URL(webId), ttlFile, 'POST', undefined);
  },

  async postDiscoverFromEndpoint({
    sparqlEndpointIri,
    dataSampleIri,
    namedGraph,
    webId
  }) {
    return rest(
      `${DISCOVER_FROM_ENDPOINT}?${getQueryString({
        sparqlEndpointIri,
        dataSampleIri,
        namedGraph,
        webId
      })}`,
      undefined,
      'POST',
      undefined
    );
  },

  async postDiscoverFromUriList({ datasourceUris, webId }) {
    return rest(
      DISCOVER_FROM_URI_LIST_URL(webId),
      datasourceUris,
      'POST',
      undefined
    );
  },

  async getDiscoveryStatus({ discoveryId }) {
    return rest(DISCOVERY_STATUS_URL(discoveryId), undefined, 'GET', undefined);
  },

  async getPipelineGroups({ discoveryId }) {
    return rest(PIPELINE_GROUPS_URL(discoveryId), undefined, 'GET', undefined);
  }
};

export default DiscoveryService;
