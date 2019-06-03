import types from './types';

const setSelectedScheme = scheme => {
  return {
    type: types.SET_SELECTED_SCHEME,
    selectedScheme: scheme
  };
};

const setSelectedNodes = (filterName, nodes) => {
  return {
    type: types.SET_SELECTED_NODES,
    nodes,
    filterName
  };
};

const toggleEnabled = value => {
  return {
    type: types.TOGGLE_ENABLED,
    value
  };
};

const toggleVisible = value => {
  return {
    type: types.TOGGLE_VISIBLE,
    value
  };
};

const setFiltersState = value => {
  return {
    type: types.SET_FILTERS_STATE,
    value
  };
};

const setDefaultFiltersState = visualizerCode => {
  return {
    type: types.SET_DEFAULT_FILTERS_STATE,
    visualizerCode
  };
};

export default {
  setSelectedScheme,
  setSelectedNodes,
  setFiltersState,
  setDefaultFiltersState,
  toggleVisible,
  toggleEnabled
};
