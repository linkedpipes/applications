import types from './types';

const INITIAL_STATE = {
  selectedScheme: null
};

const filtersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_SELECTED_SCHEME:
      return { selectedScheme: action.selectedScheme };
    default:
      return state;
  }
};

export default filtersReducer;
