import types from './types';

const setSelectedScheme = scheme => {
  return {
    type: types.SET_SELECTED_SCHEME,
    selectedScheme: scheme
  };
};

export default {
  setSelectedScheme
};
