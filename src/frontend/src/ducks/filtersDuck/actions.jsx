import types from './types';

const setSelectedScheme = scheme => {
  return {
    type: types.SET_SELECTED_SCHEME,
    selectedScheme: scheme
  };
};

const setSelectedNodes = nodes => {
  return {
    type: types.SET_SELECTED_NODES,
    nodes
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

const setDefaultFiltersState = visualizerCode => {
  return {
    type: types.SET_DEFAULT_FILTERS_STATE,
    visualizerCode
  };
};

export default {
  setSelectedScheme,
  setSelectedNodes,
  setDefaultFiltersState,
  toggleVisible,
  toggleEnabled
};
