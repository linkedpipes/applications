import axios from './api.service';

const DiscoveryService = {
  async postDiscoverFromTtl({ ttlFile, webId }) {
    return axios.post('/pipelines/discoverFromInput', ttlFile, {
      params: { webId }
    });
  },

  // Params should be sent in body, coordinate with backend guys
  async postDiscoverFromEndpoint({
    sparqlEndpointIri,
    dataSampleIri,
    namedGraph,
    webId
  }) {
    return axios.post('/pipelines/discoverFromEndpoint', null, {
      params: { sparqlEndpointIri, dataSampleIri, namedGraph, webId }
    });
  },

  // WebId should be sent in body itself
  async postDiscoverFromUriList({ datasourceUris, webId }) {
    return axios.post(
      '/pipelines/discover/',
      { datasourceUris },
      { params: { webId } }
    );
  },

  async getDiscoveryStatus({ discoveryId }) {
    return axios.get(`/discovery/${discoveryId}/status`);
  },

  async getPipelineGroups({ discoveryId }) {
    return axios.get(`/discovery/${discoveryId}/pipelineGroups`);
  }
};

export default DiscoveryService;
