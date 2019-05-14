import lpaAxios from './api.service';

// Note that axios will remove from the request params
// the params that are null or undefined

const VisualizersService = {
  getFilters: async () => {
    return lpaAxios.get('/map/properties');
  },

  // why is this a post request?
  getMarkers: async ({ resultGraphIri, filters = {} }) => {
    return lpaAxios.post('/map/markers', filters, {
      params: { resultGraphIri }
    });
  },

  getChordNodes: async (resultGraphIri, limit, offset) => {
    return lpaAxios.get('/chord/nodes', {
      params: { resultGraphIri, limit, offset }
    });
  },

  getChordData: async (resultGraphIri, nodeUris, useWeights = true) => {
    return lpaAxios.post('/chord/matrix', nodeUris, {
      params: { resultGraphIri, useWeights }
    });
  },

  getSkosScheme: async (
    schemeUri,
    resultGraphIri = null,
    conceptUri = null
  ) => {
    return lpaAxios.get('/skos/schemeSubtree', {
      params: { schemeUri, resultGraphIri, conceptUri }
    });
  },

  getSkosSchemes: async resultGraphIri => {
    return lpaAxios.get('/skos/schemes', { params: { resultGraphIri } });
  },

  getSKOSConcepts: async (resultGraphIri, schemeUri, conceptUri) => {
    return lpaAxios.get('/skos/schemeSubtree', {
      params: { resultGraphIri, schemeUri, conceptUri }
    });
  },

  getGraphExists: async graphName => {
    return lpaAxios.get('/virtuoso/graphExists', { params: { graphName } });
  }
};

export { VisualizersService };
