// ADD_SOURCE
export const addFilter = ({ filter } = {}) => ({
  type: "ADD_FILTER",
  source: filter
});

export const addFilters = ({ filters } = {}) => ({
  type: "ADD_MULTIPLE_FILTERS",
  source: filters
});
