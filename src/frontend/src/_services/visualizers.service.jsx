import { BASE_URL, rest } from "./api.service";
import { getQueryString } from "../_helpers";

const GET_MARKERS_URL = BASE_URL + "map/markers";
const GET_PROPERTIES_URL = BASE_URL + "map/properties";
const SKOS_CONCEPTS_URL = BASE_URL + "skos/concepts";
const SKOS_CONCEPTS_COUNT_URL = BASE_URL + "skos/conceptsCounts";

export const VisualizersService = {
  getFilters: async function() {
    return rest(GET_PROPERTIES_URL, undefined, "GET", undefined);
  },

  getMarkers: async function({ resultGraphIri, filters = {} }) {
    return rest(
      GET_MARKERS_URL +
        "?" +
        getQueryString({ resultGraphIri: resultGraphIri }),
      filters,
      "POST"
    );
  },

  getSKOSConcepts: async function() {
    return rest(SKOS_CONCEPTS_URL, undefined, "GET", undefined);
  },

  getSKOSConceptsCount: async function({ propertyUri, conceptUris }) {
    return rest(
      SKOS_CONCEPTS_COUNT_URL,
      { propertyUri: propertyUri, conceptUris: conceptUris },
      "POST",
      undefined
    );
  }
};
