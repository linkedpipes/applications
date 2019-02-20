import { TOGGLE_OPTION } from '../_constants/options.constants';

export const toggleFilter = option => ({
  type: TOGGLE_OPTION,
  payload: option
});
