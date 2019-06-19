import types from './types';

const INITIAL_STATE = {
  selectedApplication: {},
  selectedApplicationMetadata: undefined
};

const applicationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_APPLICATION:
      return {
        ...state,
        selectedApplication: { ...state.selectedApplication, ...action.value }
      };

    case types.SET_APPLICATION_METADATA:
      return { ...state, selectedApplicationMetadata: action.value };

    case types.RESET_APPLICATION_METADATA:
      return { ...state, selectedApplicationMetadata: undefined };

    case types.RESET_APPLICATION:
      return { ...state, selectedApplication: {} };

    case types.SET_APPLICATION_TITLE:
      return {
        ...state,
        selectedApplication: {
          ...state.selectedApplication,
          title: action.value
        }
      };
    default:
      return state;
  }
};

export default applicationReducer;
