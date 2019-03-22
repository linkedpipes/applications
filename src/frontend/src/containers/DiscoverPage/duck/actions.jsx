import types from './types';

export const incrementActiveStep = value => {
  return {
    type: types.INCREMENT_ACTIVE_STEP,
    value
  };
};

export const decrementActiveStep = value => {
  return {
    type: types.DECREMENT_ACTIVE_STEP,
    value
  };
};

export const resetActiveStep = value => {
  return {
    type: types.RESET_ACTIVE_STEP,
    value
  };
};

export const setSelectedInputExample = sample => {
  return {
    type: types.SET_SELECTED_INPUT_EXAMPLE,
    sample
  };
};

export const resetSelectedInputExample = () => {
  return {
    type: types.RESET_SELECTED_INPUT_EXAMPLE
  };
};

export const setEtlExecutionStatus = value => {
  return {
    type: types.SET_ETL_EXECUTION_STATUS,
    value
  };
};

export default {
  incrementActiveStep,
  decrementActiveStep,
  resetActiveStep,
  setSelectedInputExample,
  resetSelectedInputExample,
  setEtlExecutionStatus
};
