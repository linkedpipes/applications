// eslint-disable-next-line import/order
import lpaAxios from './api.service';

const FormData = require('form-data');

const DiscoveryService = {
  async postDiscoverFromInputFile({ rdfFile, rdfDataSampleFile, webId }) {
    const formData = new FormData();
    const dataSampleFileName = 'DataSampleFile';
    const dataSampleFileBuffer = await new Response(
      rdfDataSampleFile
    ).arrayBuffer();
    const rdfFileName = 'RdfFile';
    const rdfFileBuffer = await new Response(rdfFile).arrayBuffer();
    const webIdName = 'WebId';

    formData.append(dataSampleFileName, dataSampleFileBuffer);
    formData.append(rdfFileName, rdfFileBuffer);
    formData.append(webIdName, webId);

    return lpaAxios.post('/pipelines/discoverFromInput', formData);
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
    return lpaAxios.post('/pipelines/discoverFromInputIri', null, {
      params: { rdfInputIri, webId, dataSampleIri }
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
