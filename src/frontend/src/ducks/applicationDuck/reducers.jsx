import types from './types';

const INITIAL_STATE = { selectedApplication: {}, selectedApplicationTitle: '' };

const applicationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_APPLICATION:
      return { ...state, selectedApplication: action.value };
    case types.RESET_APPLICATION:
      return { ...state, selectedApplication: {} };
    case types.SET_APPLICATION_TITLE:
      return { ...state, selectedApplicationTitle: action.value };
    case types.RESET_APPLICATION_TITLE:
      return { ...state, selectedApplicationTitle: '' };
    default:
      return state;
  }
};

export default applicationReducer;
