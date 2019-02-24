import types from './types';

const INITIAL_STATE = {
  activeStep: 2,
  selectedInputExample: ''
};

const discoverReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INCREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return {
        ...state,
        activeStep: activeStep + value
      };
    }

    case types.DECREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return {
        ...state,
        activeStep: activeStep - value
      };
    }

    case types.RESET_ACTIVE_STEP: {
      return {
        ...state,
        activeStep: 0
      };
    }

    case types.SET_SELECTED_INPUT_EXAMPLE: {
      const { value } = action;
      return {
        ...state,
        selectedInputExample: value
      };
    }

    default: {
      return state;
    }
  }
};

export default discoverReducer;
