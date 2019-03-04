import types from './types';

const INITIAL_STATE = {
  activeStep: 0,
  selectedInputExample: '',
  etlExecutionStatus: false
};

const discoverReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INCREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return Object.assign({}, state, {
        ...state,
        activeStep: activeStep + value
      });
    }

    case types.DECREMENT_ACTIVE_STEP: {
      const { value } = action;
      const { activeStep } = state;
      return Object.assign({}, state, {
        ...state,
        activeStep: activeStep - value
      });
    }

    case types.RESET_ACTIVE_STEP: {
      return Object.assign({}, state, {
        ...state,
        activeStep: 0
      });
    }

    case types.SET_SELECTED_INPUT_EXAMPLE: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        selectedInputExample: value
      });
    }

    case types.SET_ETL_EXECUTION_STATUS: {
      const { value } = action;
      return Object.assign({}, state, {
        ...state,
        etlExecutionStatus: value
      });
    }

    default:
      return state;
  }
};

export default discoverReducer;
