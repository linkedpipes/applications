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

export default {
  setSelectedScheme,
  setSelectedNodes
};
