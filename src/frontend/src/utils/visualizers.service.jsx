import axios from './api.service';

// Note that axios will remove from the request params
// the params that are null or undefined

const VisualizersService = {
  getFilters: async () => {
    return axios.get('/map/properties');
  },

  // why is this a post request?
  getMarkers: async ({ resultGraphIri, filters = {} }) => {
    return axios.post('/map/markers', filters, { params: { resultGraphIri } });
  },

  getChordNodes: async (resultGraphIri, limit, offset) => {
    return axios.get('/chord/nodes', {
      params: { resultGraphIri, limit, offset }
    });
  },

  getChordData: async (resultGraphIri, nodeUris, useWeights = false) => {
    return axios.post(
      '/chord/matrix',
      ['value1', 'value2', 'value3', 'value4'],
      {
        params: { resultGraphIri, useWeights }
      }
    );
  },

  getSkosScheme: async (
    schemeUri,
    resultGraphIri = null,
    conceptUri = null
  ) => {
    return axios.get('/skos/schemeSubtree', {
      params: { schemeUri, resultGraphIri, conceptUri }
    });
  },

  getSKOSConcepts: async () => {
    return axios.get('/skos/schemeSubtree');
  },

  // Again, should it really be POST?
  getSKOSConceptsCount: async ({ propertyUri, conceptUris }) => {
    return axios.post('skos/conceptsCounts', { propertyUri, conceptUris });
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
