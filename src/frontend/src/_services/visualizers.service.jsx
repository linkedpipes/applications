import { BASE_URL, rest } from "./api.service";

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
  }
};
