import lpaAxios from './api.service';

const DiscoveryService = {
  async postDiscoverFromTtl({ ttlFile, webId }) {
    return lpaAxios.post('/pipelines/discoverFromInput', ttlFile, {
      params: { webId }
    });
  },

  // Params should be sent in body, coordinate with backend guys
  async postDiscoverFromEndpoint({
    sparqlEndpointIri,
    dataSampleIri,
    namedGraphs,
    webId
  }) {
    return lpaAxios.post('/pipelines/discoverFromEndpoint', null, {
      params: { sparqlEndpointIri, dataSampleIri, namedGraphs, webId }
    });
  },

  async postDiscoverFromInputIri({ rdfInputIri, webId }) {
    return lpaAxios.post('/pipelines/discoverFromInputIri', null, {
      params: { rdfInputIri, webId }
    });
  },

  // WebId should be sent in body itself
  async postDiscoverFromUriList({ datasourceUris, webId }) {
    return lpaAxios.post('/pipelines/discover/', datasourceUris, {
      params: { webId }
    });
  },

  async getDiscoveryStatus({ discoveryId }) {
    return lpaAxios.get(`/discovery/${discoveryId}/status`);
  },

  async getPipelineGroups({ discoveryId }) {
    return lpaAxios.get(`/discovery/${discoveryId}/pipelineGroups`);
  }
};

export default DiscoveryService;
