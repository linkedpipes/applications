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

  getSKOSConcepts: async () => {
    return lpaAxios.get('/skos/schemeSubtree');
  },

  // Again, should it really be POST?
  getSKOSConceptsCount: async ({ propertyUri, conceptUris }) => {
    return lpaAxios.post('skos/conceptsCounts', { propertyUri, conceptUris });
  }
};

// Maybe move to misc/utils?
const getBeautifiedVisualizerTitle = visualizerId => {
  if (visualizerId !== undefined) {
    // eslint-disable-next-line func-names no-useless-escape
    const removedUnderscore = visualizerId.replace(/_/g, ' ');
    const capitalized = removedUnderscore.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return capitalized;
  }
  return '';
};

export { VisualizersService, getBeautifiedVisualizerTitle };
