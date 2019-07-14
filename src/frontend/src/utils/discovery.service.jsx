// eslint-disable-next-line import/order
import lpaAxios from './api.service';
import jsonToFormData from 'json-form-data';

const DiscoveryService = {
  async postDiscoverFromInputFile({ rdfFile, rdfDataSampleFile, webId }) {
    const requestObject = {
      dataSampleFile: rdfDataSampleFile,
      rdfFile
    };

    const formData = jsonToFormData(requestObject, {});

    return lpaAxios.post('/pipelines/discoverFromInput', formData, {
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

  async postDiscoverFromInputIri({ rdfInputIri, webId, dataSampleIri }) {
    const params = { rdfInputIri, webId };
    if (dataSampleIri !== '') {
      params.dataSampleIri = dataSampleIri;
    }
    return lpaAxios.post('/pipelines/discoverFromInputIri', null, {
      params
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
