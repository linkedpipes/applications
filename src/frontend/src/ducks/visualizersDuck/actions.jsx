import types from './types';
import uuid from 'uuid';

const addFilter = filter => ({
  type: types.ADD_FILTER,
  payload: filter
});

const addFilters = filters => ({
  type: types.ADD_FILTERS,
  payload: filters
});

const toggleFilter = filter => ({
  type: types.TOGGLE_FILTER,
  payload: filter
});

const toggleExpandFilter = filter => ({
  type: types.TOGGLE_EXPAND_FILTER,
  payload: filter
});

const addMultipleMarkers = ({ markersList } = {}) => ({
  type: types.ADD_MULTIPLE_MARKERS,
  source: markersList
});

const toggleOption = option => ({
  type: types.TOGGLE_OPTION,
  payload: option
});

// ADD_EXPENSE
const addVisualizer = ({ visualizersArray } = {}) => ({
  type: types.ADD_VISUALIZER,
  visualizers: {
    id: uuid(),
    array: visualizersArray
  }
});

// REMOVE_SOURCE
const removePipelines = ({ id } = {}) => ({
  type: types.REMOVE_VISUALIZER,
  id
});

export default {
  addFilter,
  addFilters,
  toggleFilter,
  toggleExpandFilter,
  addMultipleMarkers,
  toggleOption,
  addVisualizer,
  removePipelines
};
