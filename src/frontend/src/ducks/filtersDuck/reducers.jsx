import types from './types';

const INITIAL_STATE = {
  selectedScheme: null,
  nodes: null
};

const filtersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_SCHEME:
      return { nodes: null, selectedScheme: action.selectedScheme };
    case types.SET_SELECTED_NODES:
      return { nodes: action.nodes, selectedScheme: null };
    default:
      return state;
  }
};

export default filtersReducer;
