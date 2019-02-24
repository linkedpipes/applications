import { Creators } from './actions';

const incrementActiveStep = Creators.incrementActiveStep;
const decrementActiveStep = Creators.decrementActiveStep;
const resetActiveStep = Creators.resetActiveStep;
const setSelectedInputExample = Creators.setSelectedInputExample;

export default {
  incrementActiveStep,
  decrementActiveStep,
  resetActiveStep,
  setSelectedInputExample
};
