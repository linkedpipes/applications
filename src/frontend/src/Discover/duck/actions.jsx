import { createActions } from 'reduxsauce';

const { Creators, Types } = createActions({
  incrementActiveStep: ['value'],
  decrementActiveStep: ['value'],
  resetActiveStep: ['value'],
  setSelectedInputExample: ['value']
});

export { Creators, Types };
