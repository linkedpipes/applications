import { BASE_URL, rest } from './api.service';
import { getQueryString } from '../_helpers';

const GET_MARKERS_URL = BASE_URL + "map/markers";
const GET_PROPERTIES_URL = BASE_URL + "map/properties";
const SKOS_CONCEPTS_URL = BASE_URL + "skos/concepts";
const SKOS_CONCEPTS_COUNT_URL = BASE_URL + "skos/conceptsCounts";
const TREEMAP_DATA_URL = BASE_URL + "hierarchy/treemap";

export const VisualizersService = {
  async getFilters() {
    return rest(GET_PROPERTIES_URL, undefined, 'GET', undefined);
  },

  async getMarkers({ resultGraphIri, filters = {} }) {
    return rest(
      GET_MARKERS_URL +
        '?' +
        getQueryString({ resultGraphIri: resultGraphIri }),
      filters,
      'POST'
    );
  },

  getTreemapData: async function() {
    return rest(TREEMAP_DATA_URL, undefined, "GET", undefined);
  },

  getSKOSConcepts: async function() {
    return rest(SKOS_CONCEPTS_URL, undefined, "GET", undefined);
  },

  async getSKOSConceptsCount({ propertyUri, conceptUris }) {
    return rest(
      SKOS_CONCEPTS_COUNT_URL,
      { propertyUri: propertyUri, conceptUris: conceptUris },
      'POST',
      undefined
    );
  }
};
