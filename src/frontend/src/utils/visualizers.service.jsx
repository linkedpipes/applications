import { BASE_URL, rest } from './api.service';
import { getQueryString } from './global.utils';

const GET_MARKERS_URL = `${BASE_URL}map/markers`;
const GET_PROPERTIES_URL = `${BASE_URL}map/properties`;
const SKOS_CONCEPTS_URL = `${BASE_URL}skos/concepts`;
const SKOS_CONCEPTS_COUNT_URL = `${BASE_URL}skos/conceptsCounts`;
const TREEMAP_DATA_URL = `${BASE_URL}hierarchy/treemap`;

const VisualizersService = {
  getFilters: async () => {
    return rest(GET_PROPERTIES_URL, undefined, 'GET', undefined);
  },

  getMarkers: async ({ resultGraphIri, filters = {} }) => {
    return rest(
      `${GET_MARKERS_URL}?${getQueryString({
        resultGraphIri
      })}`,
      filters,
      'POST'
    );
  },

  getTreemapData: async () => {
    return rest(TREEMAP_DATA_URL, undefined, 'GET', undefined);
  },

  getSKOSConcepts: async () => {
    return rest(SKOS_CONCEPTS_URL, undefined, 'GET', undefined);
  },

  getSKOSConceptsCount: async ({ propertyUri, conceptUris }) => {
    return rest(
      SKOS_CONCEPTS_COUNT_URL,
      { propertyUri, conceptUris },
      'POST',
      undefined
    );
  }
};

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
