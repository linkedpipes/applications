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

export const changeTabAction = tabValue => ({
  type: types.CHANGE_TAB,
  tabValue
});

export default {
  incrementActiveStep,
  decrementActiveStep,
  resetActiveStep,
  setSelectedInputExample,
  changeTabAction
};
