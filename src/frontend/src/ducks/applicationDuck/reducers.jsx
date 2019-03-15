import types from './types';

const INITIAL_STATE = { selectedApplication: {}, selectedApplicationTitle: '' };

const applicationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_APPLICATION:
      return { ...state, selectedApplication: action.value };
    case types.SET_APPLICATION_TITLE:
      return { ...state, selectedApplicationTitle: action.value };
    default:
      return state;
  }
};

export default applicationReducer;
