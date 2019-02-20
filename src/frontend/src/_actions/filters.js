import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER,
  ADD_FILTERS,
  ADD_FILTER
} from '../_constants/filters.constants';

export const addFilter = filter => ({
  type: ADD_FILTER,
  payload: filter
});

export const addFilters = filters => ({
  type: ADD_FILTERS,
  payload: filters
});

export const toggleFilter = filter => ({
  type: TOGGLE_FILTER,
  payload: filter
});

export const toggleExpandFilter = filter => ({
  type: TOGGLE_EXPAND_FILTER,
  payload: filter
});
