import types from './types';

const INITIAL_STATE = [];

const discoveryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_SOURCE:
      return [...state, action.source];
    case types.ADD_MULTIPLE_SOURCES:
      return state.concat(action.source);
    case types.REMOVE_SOURCE:
      return state.filter(({ url }) => url !== action.url);
    default:
      return state;
  }
};

export default discoveryReducer;
