import types from './types';

const INITIAL_STATE = {
  activeStep: 0
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

    default: {
      return state;
    }
  }
};

export default discoverReducer;
